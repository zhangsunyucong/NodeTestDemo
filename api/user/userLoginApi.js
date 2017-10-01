'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;
var decAndEncHelper = require('../../lib/util/decAndEncHelper.js').decAndEncHelper;
var resUtils = require('../../lib/util/responseUtils.js').resUtils;
var errorUtils = require('../../lib/util/ErrorCodeUtils.js').errorUtils;

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

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        if(paramUtility.isEnpty(userPhoneNum)) {
            resUtils.resWithData(res, {},"输入的手机号不能为空", errorUtils.paramsErrorCode);
            return;
        }

        if(paramUtility.isEnpty(password)) {
            resUtils.resWithData(res, {},"输入的密码不能为空", errorUtils.paramsErrorCode);
            return;
        }

        userPhoneNum = decAndEncHelper.decryptByserverPrivateKey(userPhoneNum);
        password = decAndEncHelper.decryptByserverPrivateKey(password);

        AV.User.logInWithMobilePhone(userPhoneNum, password)
            .then(function (loginedUser) {
                console.log(loginedUser);
                resUtils.resWithData(res, loginedUser,"登录成功", errorUtils.successCode);
            }, function (error) {
                resUtils.resWithData(res, {},"用户名和密码不匹配", error.code);
            });

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

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        if(paramUtility.isEnpty(userName)) {
            resUtils.resWithData(res, {},"输入的用户名不能为空", errorUtils.paramsErrorCode);
            return;
        }

        if(paramUtility.isEnpty(password)) {
            resUtils.resWithData(res, {},"输入的密码不能为空", errorUtils.paramsErrorCode);
            return;
        }

        userName = decAndEncHelper.decryptByserverPrivateKey(userName);
        password = decAndEncHelper.decryptByserverPrivateKey(password);

        AV.User.logIn(userName, password)
            .then(function (loginUser) {
                resUtils.resWithData(res, loginUser,"登录成功", errorUtils.successCode);
            }, function (err) {
                resUtils.resWithData(res, {},"用户名和密码不匹配", err.code);
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

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        if(paramUtility.isEnpty(userPhoneNum)) {
            resUtils.resWithData(res, {},"输入的手机号不能为空", errorUtils.paramsErrorCode);
            return;
        }

        if(paramUtility.isEnpty(smsCode)) {
            resUtils.resWithData(res, {},"输入的验证码不能为空", errorUtils.paramsErrorCode);
            return;
        }

        userPhoneNum = decAndEncHelper.decryptByserverPrivateKey(userPhoneNum);

        AV.User.signUpOrlogInWithMobilePhone(userPhoneNum, smsCode)
            .then(function (success) {
                resUtils.resWithData(res, success,"验证通过", errorUtils.successCode);
            }, function (error) {
                // 失败
                resUtils.resWithData(res, {},error.message, error.code);
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