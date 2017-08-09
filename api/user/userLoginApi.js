'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;

AV.Cloud.useMasterKey();


exports.userLoginApi = function (app) {
    app.get('/user/login', function (req, res) {
        var userName = req.query.userName;
        var password = req.query.password;

        var resJson;

        if(paramUtility.isEnpty(userName)) {
            resJson = {
                "data": {},
                "msg": "输入的用户名不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        if(paramUtility.isEnpty(password)) {
            resJson = {
                "data": {},
                "msg": "输入的密码不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        AV.User.logIn(userName, password)
            .then(function (loginUser) {
                resJson = {
                    "data": loginUser,
                    "msg": "登录成功",
                    "status": 200
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));
            }, function (err) {
                resJson = {
                    "data": {},
                    "msg": "用户名和密码不匹配",
                    "status": err.code
                };
               // console.log(paramUtility.getParamType(resJson));
                //console.log(paramUtility.getParamType(jsonUtil.josnObj2JsonString(resJson)));
                res.end(jsonUtil.josnObj2JsonString(resJson));
            });
    });

    app.get('/user/loginByMobile/:userPhoneNum/:password', function (req, res) {
        var userPhoneNum = req.params.userPhoneNum;
        var password = req.params.password;

        var resJson;

        if(paramUtility.isEnpty(userPhoneNum)) {
            resJson = {
                "data": {},
                "msg": "输入的手机号不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        if(paramUtility.isEnpty(password)) {
            resJson = {
                "data": {},
                "msg": "输入的密码不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        AV.User.logInWithMobilePhone(userPhoneNum, password)
            .then(function (loginedUser) {
                console.log(loginedUser);
                resJson = {
                    "data": loginedUser,
                    "msg": "登录成功",
                    "status": 200
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));
            }, (function (error) {
                resJson = {
                    "data": {},
                    "msg": "用户名和密码不匹配",
                    "status": err.code
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));
            }));

    });

    app.get('/user/loginByName/:userName/:password', function (req, res) {
        var userName = req.params.userName;
        var password = req.params.password;

        var resJson;

        if(paramUtility.isEnpty(userName)) {
            resJson = {
                "data": {},
                "msg": "输入的用户名不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        if(paramUtility.isEnpty(password)) {
            resJson = {
                "data": {},
                "msg": "输入的密码不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        AV.User.logIn(userName, password)
            .then(function (loginUser) {
                resJson = {
                    "data": loginUser,
                    "msg": "登录成功",
                    "status": 200
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));
            }, function (err) {
                resJson = {
                    "data": {},
                    "msg": "用户名和密码不匹配",
                    "status": err.code
                };
                // console.log(paramUtility.getParamType(resJson));
                //console.log(paramUtility.getParamType(jsonUtil.josnObj2JsonString(resJson)));
                res.end(jsonUtil.josnObj2JsonString(resJson));
            });
    });

    //user/loginByName/{userPhoneNum}/{smsCode}
    app.get('/user/loginBySMSCode/:userPhoneNum/:smsCode', function (req, res) {
        var userPhoneNum = req.params.userPhoneNum;
        var smsCode = req.params.smsCode;

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
                resJson = {
                    "data": {},
                    "msg": "验证通过",
                    "status": 200
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));
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

};