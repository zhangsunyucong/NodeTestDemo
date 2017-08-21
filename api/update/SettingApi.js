'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;
var decAndEncHelper = require('../../lib/util/decAndEncHelper.js').decAndEncHelper;
var resUtils = require('../../lib/util/responseUtils.js').resUtils;
var errorUtils = require('../../lib/util/ErrorCodeUtils.js').errorUtils;

exports.settingApi = function (app) {

    app.get('/update/getUpdateInfo', function (req, res) {

        var query = new AV.Query('update');
         query.find().then(function (results) {

            if(!paramUtility.isNULL(results) && paramUtility.isArray(results)) {
                if(results.length > 0) {
                    resUtils.resWithData(res, results[0], "", errorUtils.successCode);
                } else {
                    resUtils.resWithData(res, {}, "没有数据", errorUtils.noData);
                }
            }

        }, function (error) {
             resUtils.resWithData(res, {}, error.message, error.code);
        });
    });

    app.post('/feedback/feed', function (req, res) {
        var content = req.body.content;
        var userPhoneNum = req.body.usePhoneNum;
        var clientType = req.body.clientType;

        if(paramUtility.isEnpty(content)) {
            resUtils.resWithData(res, "", "请输入吐槽的内容", errorUtils.paramsErrorCode);
            return;
        }

        var Feedback = AV.Object.extend('Feedback');
        var feedback = new Feedback();
        feedback.set('clientType', clientType);
        feedback.set('content', content);
        feedback.set('userPhoneNum', userPhoneNum);
        feedback.save().then(function (object) {
            resUtils.resWithData(res, "提交成功", "感谢你的吐槽", errorUtils.successCode);
        }, function (error) {
            resUtils.resWithData(res, "", error.message, error.code);
        });

    });
};