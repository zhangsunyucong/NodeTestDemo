'use strict';
/********************************************************************************
文件用途说明：注册用的接口
*******************************************************************************/

var mysql = new require('../../lib/db/dbMysql.js').G_DB;
var log = new require('../../lib/common/log.js');

/*************************************************************
函数名：registerApi
功能：注册的接口函数
创建信息：欧聪
输入参数:app：配置好的express
修改信息：无
审查人：黎萍
*************************************************************/

exports.registerApi = function (app) {
    /*************************************************************
    用户注册请求接口
    功能：用户注册请求接口 
    输入参数:无
    返回值：无
    创建信息：欧聪
    修改信息：欧聪  优化代码
              欧聪  添加参数校验
    审查人：黎萍
    *************************************************************/
    app.post('/api/regist', function (req, res) {  
        var userName = req.body.Tel;
        var passWord = req.body.Password;
        var safeQuetion = req.body.SafeQuetion;//可为空
        var safeAnswer = req.body.SafeAnswer;//可为空
        if (!userName && !passWord) {
            var json = { data: {}, msg: '用户名或密码为空', status: 400 };
            res.send(200, JSON.stringify(json));
            return;
        }
        var callback = function (err) {
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
        }
        var sqlParam = { 'UserName': userName, 'PassWord': passWord, 'Tel': userName, 'SafeQuetion': safeQuetion, 'SafeAnswer': safeAnswer };
        var sql = 'insert into users set ?';
        mysql.queryParam(sql, sqlParam, callback);
        res.send(200, { "data": {}, "msg": "注册成功", "status": 200 });
    });
    /*************************************************************
    查询是否已注册接口
    功能：查询是否已注册接口 
    创建信息：欧聪（2014-06-4）
    输入参数:无
    修改信息：欧聪（2014-07-01）修改了查询语句
    审查人：黎萍（2014-06-24） 
    *************************************************************/
    app.post('/api/queryUser', function (req, res) {  
        var userName = req.body.Tel;
        var callback = function (err, rows) {
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
                console.log('user name is: ', rows[0].UserName);
                res.send(200, { "data": {}, "msg": "*该用户已注册", "status": 200 });
            } else {
                res.send(200, { "data": {}, "msg": "", "status": 201 });
            }

        }
        var sqlParam = [userName ];
        var sql = 'select UserName from users where UserName=?';
        mysql.queryParam(sql,sqlParam, callback);
    });
}
