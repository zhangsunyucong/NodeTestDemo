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

    app.get('/user/register/:userName/:password', function(req, res) {
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
        // 设置邮箱
        user.setEmail('tom@leancloud.cn');
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