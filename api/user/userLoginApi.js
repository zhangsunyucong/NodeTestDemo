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

    app.get('/user/login/:userName/:password', function (req, res) {
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
};