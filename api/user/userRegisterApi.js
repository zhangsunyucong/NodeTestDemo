/**
 * Created by hyj on 2017/8/4 0004.
 */
'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;

AV.Cloud.useMasterKey();

exports.userRegisterApi = function(app) {

    app.get('/user/register/requestSmsCode/:userPhoneNum', function (req, res) {

        var userPhoneNum = req.params.userPhoneNum;

        var resJson;

        if(paramUtility.isEnpty(userPhoneNum)) {
            resJson = {
                "data": "",
                "msg": "手机号不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        //手机号格式验证
        /*if() {

        }*/

        AV.Cloud.requestSmsCode(userPhoneNum).then(function (success) {
            resJson = {
                "data": "手机验证码已经发送",
                "msg": "手机验证码已经发送",
                "status": 200
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        }, function (error) {
            resJson = {
                "data": "手机验证码发送失败",
                "msg": error.message,
                "status": error.code
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        });

    });

    app.get('/user/register/byPhoneNum/:userPhoneNum/:nickName/:smsCode/:password', function (req, res) {

        var userPhoneNum = req.params.userPhoneNum;
        var nickName = req.params.nickName;
        var smsCode = req.params.smsCode;
        var password = req.params.password;

        var resJson;
        if(paramUtility.isEnpty(userPhoneNum)) {
            resJson = {
                "data": "",
                "msg": "输入的手机号不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        if(paramUtility.isEnpty(smsCode)) {
            resJson = {
                "data": "",
                "msg": "输入的验证码不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        AV.User.signUpOrlogInWithMobilePhone(userPhoneNum, smsCode)
            .then(function (success) {
                var query = new AV.Query('_User');
                query.equalTo("mobilePhoneNumber", userPhoneNum);
                query.find().then(function (results) {
                    var result = results[0];
                    result.setPassword(password);
                    result.setUsername(nickName);
                    result.save().then(function (result) {
                        resJson = {
                            "data": {},
                            "msg": "验证通过",
                            "status": 200
                        };
                        res.end(jsonUtil.josnObj2JsonString(resJson));
                    }, function (error) {
                        resJson = {
                            "data": "",
                            "msg": error.message,
                            "status": 201
                        };
                        res.end(jsonUtil.josnObj2JsonString(resJson));
                    });
                }, function (error) {
                    resJson = {
                        "data": "",
                        "msg": error.message,
                        "status": 201
                    };
                    res.end(jsonUtil.josnObj2JsonString(resJson));
                });
            }, function (error) {
                // 失败
                resJson = {
                    "data": "",
                    "msg": error.message,
                    "status": 201
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));
        });
    });

    app.get('/user/register/ByUserName/:userName/:password', function(req, res) {
        //获取参数
        var userName = req.params.userName;
        var password = req.params.password;
        //响应对象
        var resJson;
        //参数检查有效性
        if(paramUtility.isEnpty(userName) || paramUtility.isEnpty(password)) {
            resJson = {
                "data": {},
                "msg": "参数检查不对",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return
        }
        //表名称
        // 新建 AVUser 对象实例
        var user = new AV.User();
        // 设置用户名
        user.setUsername(userName);
        // 设置密码
        user.setPassword(password);

        user.signUp().then(function (loginedUser) {
            //成功响应
            resJson = {
                "data": todo.id,
                "msg": '小伙子（大美女)' + loginedUser.getUsername() + '终于等到你了，马上去登录吧',
                "status": 200
            };
            console.log(loginedUser);
            res.end(jsonUtil.josnObj2JsonString(resJson));
        }, function (error) {
            //异常响应
            resJson = {
                "data": ''+ userName + '用户名已经存在',
                "msg": error.message,
                "status": error.code
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        });

    });

};