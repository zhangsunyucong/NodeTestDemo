'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;

AV.Cloud.useMasterKey();

/***********************************************************************************
 * 创建人：何允俭
 * 创建日期：2017-08-13
 * 功能说明：登录功能模块
 ***********************************************************************************/
exports.userLoginApi = function (app) {

    /***********************************************************************************
     * 创建人：何允俭
     * 创建日期：2017-08-13
     * 功能说明：用户通过手机号和密码登录
     * 参数说明：userPhoneNum 手机号
     *          password 用户登录密码
     * 返回值：用户信息
     * 评审人：
     * 评审时间：
     ***********************************************************************************/
    app.post('/user/loginByMobile', function (req, res) {
        var userPhoneNum = req.body.userPhoneNum;
        var password = req.body.password;

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
                    "status": error.code
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));
            }));

    });

    /***********************************************************************************
     * 创建人：何允俭
     * 创建日期：2017-08-13
     * 功能说明：用户通过用户名和密码登录
     * 参数说明：userName 用户名
     *          password 用户登录密码
     * 返回值：用户信息
     * 评审人：
     * 评审时间：
     ***********************************************************************************/
    app.post('/user/loginByName', function (req, res) {
        var userName = req.body.userName;
        var password = req.body.password;

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

                res.end(jsonUtil.josnObj2JsonString(resJson));
            });
    });

    /***********************************************************************************
     * 创建人：何允俭
     * 创建日期：2017-08-13
     * 功能说明：用户通过手机验证码登录
     * 参数说明：userPhoneNum 手机号
     *          smsCode 手机验证码
     * 返回值：用户信息
     * 评审人：
     * 评审时间：
     ***********************************************************************************/
    app.post('/user/loginBySMSCode', function (req, res) {
        var userPhoneNum = req.body.userPhoneNum;
        var smsCode = req.body.smsCode;

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

        if(paramUtility.isEnpty(smsCode)) {
            resJson = {
                "data": {},
                "msg": "输入的验证码不能为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        AV.User.signUpOrlogInWithMobilePhone(userPhoneNum, smsCode)
            .then(function (success) {

                resJson = {
                    "data": success,
                    "msg": "验证通过",
                    "status": 200
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));

            }, function (error) {
                // 失败
                resJson = {
                    "data": {},
                    "msg": error.message,
                    "status": 201
                };
                res.end(jsonUtil.josnObj2JsonString(resJson));
            });
    });

    var getUserInfosByUserPhoneNum = function (userPhoneNum, failCallback, successCallback) {
        if(paramUtility.isEnpty(userPhoneNum)) {
            failCallback('手机号不能为空');
            return;
        }

        var query = new AV.Query('_User');
        query.equalTo("mobilePhoneNumber", userPhoneNum);
        query.find().then(function (results) {
            successCallback(results);
        }, function (error) {
            failCallback(error.message);
        });
    };

    var getUserInfosByUserName = function (userName, failCallback, successCallback) {
        if(paramUtility.isEnpty(userName)) {
            failCallback('用户名/昵称不能为空');
            return;
        }

        var query = new AV.Query('_User');
        query.equalTo("username", userName);
        query.find().then(function (results) {
            successCallback(results);
        }, function (error) {
            failCallback(error.message);
        });
    };

};