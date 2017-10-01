/**
 * Created by hyj on 2017/8/4 0004.
 */
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
 * 功能说明：注册功能模块
 ***********************************************************************************/

exports.userRegisterApi = function(app) {

    /***********************************************************************************
     * 创建人：何允俭
     * 创建日期：2017-08-13
     * 功能说明：请求手机验证码
     * 参数说明：userPhoneNum 手机号
     * 返回值：
     * 评审人：
     * 评审时间：
     ***********************************************************************************/
    app.post('/user/register/requestSmsCode', function (req, res) {

        var userPhoneNum = req.body.userPhoneNum;

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        if(paramUtility.isEnpty(userPhoneNum)) {
            resUtils.resWithData(res, "", "手机号不能为空", errorUtils.paramsErrorCode);
            return;
        }

        userPhoneNum = decAndEncHelper.decryptByserverPrivateKey(userPhoneNum);

        //手机号格式验证
        /*if() {

        }*/

        AV.Cloud.requestSmsCode(userPhoneNum).then(function (success) {
            resUtils.resWithData(res, "手机验证码已经发送", "手机验证码已经发送", errorUtils.successCode);
        }, function (error) {
            resUtils.resWithData(res, "手机验证码发送失败", error.message, error.code);
        });

    });

    /***********************************************************************************
     * 创建人：何允俭
     * 创建日期：2017-08-13
     * 功能说明：通过手机号注册
     * 参数说明：userPhoneNum 手机号
     *          nickName 昵称
     *          smsCode 短信验证码
     *          password 密码
     * 返回值：
     * 评审人：
     * 评审时间：
     ***********************************************************************************/
    app.post('/user/register/byPhoneNum', function (req, res) {

        var userPhoneNum = req.body.userPhoneNum;
        var nickName = req.body.nickName;
        var smsCode = req.body.smsCode;
        var password = req.body.password;

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        if(paramUtility.isEnpty(userPhoneNum)) {
            resUtils.resWithData(res, "", "输入的手机号不能为空", errorUtils.paramsErrorCode);
            return;
        }

        if(paramUtility.isEnpty(smsCode)) {
            resUtils.resWithData(res, "", "输入的验证码不能为空", errorUtils.paramsErrorCode);
            return;
        }

        userPhoneNum = decAndEncHelper.decryptByserverPrivateKey(userPhoneNum);
        nickName = decAndEncHelper.decryptByserverPrivateKey(nickName);
        password = decAndEncHelper.decryptByserverPrivateKey(password);

        AV.User.signUpOrlogInWithMobilePhone(userPhoneNum, smsCode)
            .then(function (success) {
                var query = new AV.Query('_User');
                query.equalTo("mobilePhoneNumber", userPhoneNum);
                query.find().then(function (results) {
                    var result = results[0];
                    result.setPassword(password);
                    result.setUsername(nickName);
                    result.save().then(function (result) {
                        resUtils.resWithData(res, "", "验证通过", errorUtils.successCode);
                    }, function (error) {
                        resUtils.resWithData(res, "", error.message, error.code);
                    });
                }, function (error) {
                    resUtils.resWithData(res, "", error.message, error.code);
                });
            }, function (error) {
                // 失败
                resUtils.resWithData(res, "", error.message, error.code);
        });
    });

    /***********************************************************************************
     * 创建人：何允俭
     * 创建日期：2017-08-13
     * 功能说明：通过用户名注册
     * 参数说明：userName 昵称
     *          password 密码
     * 返回值：
     * 评审人：
     * 评审时间：
     ***********************************************************************************/
    app.post('/user/register/ByUserName', function(req, res) {
        //获取参数
        var userName = req.body.userName;
        var password = req.body.password;

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        //参数检查有效性
        if(paramUtility.isEnpty(userName) || paramUtility.isEnpty(password)) {
            resUtils.resWithData(res, "", "参数检查不对", errorUtils.paramsErrorCode);
            return
        }

        userName = decAndEncHelper.decryptByserverPrivateKey(userName);
        password = decAndEncHelper.decryptByserverPrivateKey(password);

        //表名称
        // 新建 AVUser 对象实例
        var user = new AV.User();
        // 设置用户名
        user.setUsername(userName);
        // 设置密码
        user.setPassword(password);

        user.signUp().then(function (loginedUser) {
            //成功响应
            resUtils.resWithData(res, loginedUser.id,
                '小伙子（大美女)' + loginedUser.getUsername() + '终于等到你了，马上去登录吧',
                errorUtils.successCode);
            console.log(loginedUser);
        }, function (error) {
            //异常响应
            resUtils.resWithData(res, ''+ userName + '用户名已经存在',
                error.message, error.code);
        });

    });

};