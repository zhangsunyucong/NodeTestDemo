'use strict';
/********************************************************************************
 文件用途说明：登录的接口，还用于找回密码
 *******************************************************************************/

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var md5 = require('../../lib/util/md5.js'); //引入md5.js
var mysql = require('../../lib/db/dbMysql.js').G_DB;
var log = new require('../../lib/common/log.js');
var async = require('async'); //同步库

var ipBlackList = require('../ipBlackList.js');
var session = require('../session.js');

/********************************************************************************
 函数名：loginApi
 功能：登录接口函数
 输入参数：app：配置好的express
 返回值：无
 创建信息：欧聪（2014-06-10）
 修改记录：无
 审查人：黎萍（2014-06-24）
 *******************************************************************************/

exports.loginApi = function (app) {

    /********************************************************************************
     函数名：login
     功能：登陆接口，写后台cookie，传递参数到前台
     输入参数：username   用户名
     password   密码
     返回值：无
     创建信息：韦友爱（2014-06-03）
     修改记录：韦友爱（2014-06-05） 添加res.send返回的数据status
     修改记录：谭健康（2014-06-08） 引用数据库后实例化loginconn使用数据库链接
     sql语句查询不能用select * 用什么查什么
     用回app.get 格式
     欧聪 （2014-06-10）  修改SQL语句拼接方式
     欧聪 （2014-06-10）  增加了传递回去的参数
     审查人：谭健康
     审查人：黎萍（2014-06-24）
     *******************************************************************************/

    app.get('/api/login/:userName/:password', function (req, res) {  // named route parameter  // 命名的远程参数
        if (ipBlackList.isBlackIP(req.ip, res)) { return; }
        //接收数据
        var userName = req.params.userName;
        var passWord = req.params.password;
        var userId;
        if (!userName && !passWord) {
            var json = {
                "data": {},
                "msg": '用户名或密码为空',
                "status": 401
            };
            res.send(401, JSON.stringify(json));
            return;
        }

        //使用瀑布流来保证查询顺序同步 样式：async.waterfall([function1,function2,.....],endfunction(){})
        async.waterfall([
                function (cb) {
                    var sqlParam = [userName, passWord];
                    var sql = 'select UserName,PassWord,UserID from users where UserName =? and PassWord=?';
                    mysql.queryParam(sql, sqlParam, function (err, rows) {
                        if (err) {
                            log.error('查询[users]表出错', err);
                            var json = {
                                "data": {},
                                "msg": '查询[users]表出错',
                                "status": 400
                            };
                            res.send(200, JSON.stringify(json));
                            return;
                        }
                        if (rows && rows.length > 0) {
                            //能查询到数据，登陆成功
                            userId = rows[0].UserID;
                            console.log('successful loging');
                            //执行瀑布流数组中下一个函数
                            cb(err, 0);
                        } else {
                            console.log('username or password is false');
                            var json = {
                                "data": {
                                    success: false
                                },
                                "msg": '用户名或密码错误',
                                "status": 201
                            };
                            //加入黑名单
                            ipBlackList.addToBlackList(req.ip, '找回密码用户不存在');
                            res.send(201, JSON.stringify(json));
                        }
                    });
                },
                function (param, cb) {//查询vip信息返回前台
                    //声明需要返回的参数
                    var vipData = { Registed: [] };
                    //var vipKey = '';
                    var sqlParam = [userName];
                    var sql = 'select a.AppEName,v.AppID,MAX(v.Endtime) as Endtime,v.UserID from vip v  inner join app a on a.AppID = v.AppID inner join users u on v.UserID=u.UserID and u.UserName = ? where v.Endtime > now() group by v.UserID,a.AppID ';
                    mysql.queryParam(sql, sqlParam, function (err, rows) {
                        if (err) {
                            log.error('查询[vip]表出错', err);
                            var json = {
                                "data": {},
                                "msg": '查询[vip]表出错',
                                "status": 400
                            };
                            res.send(200, JSON.stringify(json));
                            return;
                        }
                        if (rows && rows.length > 0) {
                            //能查询到数据，设置COOKIE
                            for (var i = 0; i < rows.length; i++) {
                                vipData.Registed.push({
                                    "AppID": rows[i].AppID,
                                    "AppEName": rows[i].AppEName,
                                    "Endtime": rows[i].Endtime
                                });
                            }
                            //vipKey = md5.hex_md5(JSON.stringify(vipData) + 'ytsoft');
                            //记录session
                            var guid = session.addSession(userName, vipData, req.ip);
                            json = {
                                "data": {
                                    "userId": userId,
                                    "success": true,
                                    //vip"data": vipData,
                                    //vipKey: vipKey,
                                    "guid": guid
                                },
                                "msg": '登陆成功',
                                "status": 200
                            };
                            res.send(200, JSON.stringify(json));
                        } else {
                            console.log('can not get data from VIP table!');
                            var guid = session.addSession(userName, {}, req.ip);
                            json = {
                                "data": {
                                    "userId": userId,
                                    "success": true,
                                    "guid": guid
                                    //vip"data": vipData,
                                    //vipKey: vipKey
                                },
                                "msg": '登陆成功，但无法获取VIP信息',
                                "status": 201
                            };
                            res.send(200, JSON.stringify(json));
                        }
                        cb(err, param);
                    });
                } ],
            function (err, param) {
                if (err) {
                    log.error('查询出错', err);
                }
            });
    });
    /********************************************************************************
     函数名：findQuestion
     功能：查询安全问题接口。查询用户名是否存在，存在则返回其对应的安全问题
     输入参数：username：用户名
     返回值：无
     创建信息：韦友爱（2014-06-04）
     修改记录：韦友爱（2014-06-05） 添加res.send返回的数据status
     谭健康（2014-06-08）引用数据库后实例化loginconn使用数据库链接
     谭健康（2014-06-08）带参数的数据库链接查询
     韦友爱（2014-06-09）修改sq数据库查询语句
     欧聪 （2014-06-10）   修改SQL语句拼接方式
     韦友爱（2014-06-25）修改返回json数据格式
     韦友爱（2014-06-27）将if else用防御式编程
     审查人：黎萍（2014-06-24）
     审查人：黎萍（2014-06-27）
     *******************************************************************************/
    app.get('/api/findQuestion/:userName', function (req, res) {
        if (ipBlackList.isBlackIP(req.ip, res)) { return; }
        //接收数据
        var userName = req.params.userName;
        var callback = function (err, rows) {
            if (err) {
                log.error('查询错误', err);
                var json = {
                    "data": {},
                    "msg": err,
                    "status": 400
                };
                res.send(203, JSON.stringify(json));
                return;
            }
            if (rows && rows.length > 0) {
                if (rows[0].SafeQuetion) {
                    var json = {
                        "data": rows[0].SafeQuetion,
                        "msg": '成功',
                        "status": 200
                    };
                    res.send(200, JSON.stringify(json));
                    return;
                } else {
                    var json = {
                        "data": '',
                        "msg": '未设置安全问题',
                        "status": 202
                    };
                    res.send(202, JSON.stringify(json));
                    return;
                }
            }
            var json = {
                "data": '',
                "msg": '手机号码不存在',
                "status": 201
            };
            //加入黑名单
            ipBlackList.addToBlackList(req.ip, '找回密码用户不存在');
            res.send(201, JSON.stringify(json));
        }
        var sqlParam = [userName];
        var sql = 'select UserName,SafeQuetion from users where UserName=?';
        mysql.queryParam(sql, sqlParam, callback);
    });
    /********************************************************************************
     函数名：checkAnswer
     功能：校验安全问题答案接口
     输入参数：username：用户名
     answer：密保答案
     返回值：
     创建信息：韦友爱（2014-06-04）
     修改记录：韦友爱（2014-06-05）  添加res.send返回的数据status
     韦友爱（2014-06-09）  修改sq数据库查询语句）
     欧聪 （2014-06-10）   修改SQL语句拼接方式
     韦友爱（2014-06-25）修改返回json数据格式
     韦友爱（2014-06-27）将if else用防御式编程
     审查人：黎萍（2014-06-24）
     审查人：黎萍（2014-06-27）
     *******************************************************************************/
    app.get('/api/checkAnswer/:userName/:answer', function (req, res) {
        if (ipBlackList.isBlackIP(req.ip, res)) { return; }
        var userName = req.params.userName;
        var answer = req.params.answer;
        var sqlParam = [userName, answer];
        var sql = 'select UserName from users where UserName=? and SafeAnswer=?';
        var callback = function (err, rows) {
            if (err) {
                log.error('查询错误', err);
                var json = {
                    "data": {},
                    "msg": err,
                    "status": 202
                };
                res.send(400, JSON.stringify(json));
                return;
            }
            if (rows && rows.length > 0) {
                //记录session
                var guid = session.addSession(userName, {}, req.ip);
                var json = {
                    "data": guid,
                    "msg": '成功',
                    "status": 200
                };

                res.send(200, JSON.stringify(json));
                return;
            }
            var json = {
                "data": '',
                "msg": '答案错误',
                "status": 201
            };
            //加入黑名单
            ipBlackList.addToBlackList(req.ip, '找回密码回答错误');
            res.send(201, JSON.stringify(json));
        }
        mysql.queryParam(sql, sqlParam, callback);
    });
    /********************************************************************************
     函数名：updatePassword
     功能：修改密码接口
     输入参数：username 用户名
     newPassword 新密码
     返回值：json数据 {"msg":"successful updata password"}
     创建信息：韦友爱（2014-06-04）
     修改记录：韦友爱（2014-06-05） 添加res.send返回的数据status
     韦友爱（2014-06-25）修改返回json数据格式
     韦友爱（2014-06-27）将if else用防御式编程
     审查人：黎萍（2014-06-24）
     *******************************************************************************/
    app.get('/api/updatePassword/:userName/:newPassword/:guid', function (req, res) {
        if (ipBlackList.isBlackIP(req.ip, res)) { return; }
        var userName = req.params.userName;
        var password = req.params.newPassword;
        var guid = req.params.guid;
        //验证guid
        if (session.checkSession(userName, guid, req.ip) !== 0) {
            var json = {
                "data": '',
                "msg": 'guid效验失败',
                "status": 201
            };
            res.send(201, JSON.stringify(json));
            return;
        }
        var sqlParam = [password, userName];
        var sql = 'update users set PassWord=? where UserName=?';
        var callback = function (err, rows) {
            if (err) {
                log.error('查询出错', err);
                return;
            }
            var json = {
                "data": '',
                "msg": '成功',
                "status": 200
            };
            res.send(200, JSON.stringify(json));
        }
        mysql.queryParam(sql, sqlParam, callback);
    });
}

