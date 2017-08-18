'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;

exports.settingApi = function (app) {

    app.get('/update/getUpdateInfo', function (req, res) {

        var resJson;
        var query = new AV.Query('update');
         query.find().then(function (results) {

            if(!paramUtility.isNULL(results) && paramUtility.isArray(results)) {
                if(results.length > 0) {
                    resJson = {
                        "data": results[0],
                        "msg": "",
                        "status": 200
                    };
                } else {
                    resJson = {
                        "data": {},
                        "msg": "没有数据",
                        "status": 201
                    };
                }
                res.end(jsonUtil.josnObj2JsonString(resJson));
            }

        }, function (error) {
            resJson = {
                "data": {},
                "msg": error.message,
                "status": error.code
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        });
    });

    app.post('/feedback/feed', function (req, res) {
        var content = req.body.content;
        var userPhoneNum = req.body.usePhoneNum;
        var clientType = req.body.clientType;

        var resJson;

        if(paramUtility.isEnpty(content)) {
            resJson = {
                "data": "",
                "msg": "请输入吐槽的内容！",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
            return;
        }

        var Feedback = AV.Object.extend('Feedback');
        var feedback = new Feedback();
        feedback.set('clientType', clientType);
        feedback.set('content', content);
        feedback.set('userPhoneNum', userPhoneNum);
        feedback.save().then(function (object) {
            resJson = {
                "data": "提交成功",
                "msg":"提交成功",
                "status": 200
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        }, function (error) {
            resJson = {
                "data": "",
                "msg":error.message,
                "status": error.error
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        });

    });
};