'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;
var decAndEncHelper = require('../../lib/util/decAndEncHelper.js').decAndEncHelper;
var resUtils = require('../../lib/util/responseUtils.js').resUtils;
var errorUtils = require('../../lib/util/ErrorCodeUtils.js').errorUtils;

/***********************************************************************************
 * 创建人：何允俭
 * 创建日期：2017-08-14
 * 功能说明：简历相关功能模块
 ***********************************************************************************/
exports.vitaeApi = function (app) {

    app.post('/album/getInfo', function (req, res) {

        var userId = req.body.userId;

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        userId = decAndEncHelper.decryptByserverPrivateKey(userId);

        var query = new AV.Query('AlBum');
        query.equalTo("userId", userId);
        query.find().then(function (results) {
            if(!paramUtility.isEnpty(results) && results.length > 0) {
                resUtils.resWithData(res, results[0], "", errorUtils.successCode);
            } else {
                resUtils.resWithData(res, {}, "没有数据", errorUtils.noData);
            }
        }, function (error) {
            resUtils.resWithData(res, {}, error.message, error.code);
        });
    });

    app.post('/album/add', function (req, res) {

        var userId = req.body.userId;
        var url = req.body.url;

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        userId = decAndEncHelper.decryptByserverPrivateKey(userId);

        var query = new AV.Query('AlBum');
        query.equalTo("userId", userId);
        query.find().then(function (results) {
            if(!paramUtility.isEnpty(results) && results.length > 0) {

                var photoDetails = results[0].attributes.photoDetails;

                var temp;
                var newphotoDetails = new Array(photoDetails.length + 1);
                for(var i = 0; i < photoDetails.length; i++) {
                    newphotoDetails[i] = photoDetails[i];
                }

                newphotoDetails[photoDetails.length] = url;

                results[0].set("photoDetails", newphotoDetails);

                results[0].save().then(function (obj) {
                    resUtils.resWithData(res, obj, "", errorUtils.successCode);
                }, function (error) {
                    resUtils.resWithData(res, {}, error.message, error.code);
                });

            } else {
                // 声明类型
                var AlBum = AV.Object.extend('AlBum');
                // 新建对象
                var alBum = new AlBum();
                // 设置名称
                alBum.set("userId", userId);

                var photoDetails = new Array(1);
                photoDetails[0] = url;
                alBum.set("photoDetails", photoDetails);
                alBum.save().then(function (obj) {
                    resUtils.resWithData(res, obj, "", errorUtils.successCode);
                }, function (error) {
                    resUtils.resWithData(res, {}, error.message, error.code);
                });
            }
        }, function (error) {
            resUtils.resWithData(res, {}, error.message, error.code);
        });
    });

    app.post('/album/delete', function (req, res) {

        var userId = req.body.userId;
        var url = req.body.url;

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        userId = decAndEncHelper.decryptByserverPrivateKey(userId);

        var query = new AV.Query('AlBum');
        query.equalTo("userId", userId);
        query.find().then(function (results) {
            if(!paramUtility.isEnpty(results) && results.length > 0) {

                var photoDetails = results[0].attributes.photoDetails;

                var temp;
                var newphotoDetails = new Array(photoDetails.length - 1);
                for(var i = 0; i < photoDetails.length; i++) {
                    if(photoDetails[i] === url) {
                        continue;
                    }
                    newphotoDetails[i] = photoDetails[i];
                }
                results[0].set("photoDetails", newphotoDetails);

                results[0].save().then(function (obj) {
                    resUtils.resWithData(res, obj, "", errorUtils.successCode);
                }, function (error) {
                    resUtils.resWithData(res, {}, error.message, error.code);
                });

            } else {
                resUtils.resWithData(res, {}, "没有数据", errorUtils.noData);
            }
        }, function (error) {
            resUtils.resWithData(res, {}, error.message, error.code);
        });
    });

    /***********************************************************************************
     * 创建人：何允俭
     * 创建日期：2017-08-14
     * 功能说明：获取简历的信息
     * 参数说明：userId 用户id
     * 返回值：简历的信息
     * 评审人：
     * 评审时间：
     ***********************************************************************************/
    app.post('/vitae/getInfo', function (req, res) {

        var userId = req.body.userId;

        if(!decAndEncHelper.valideReqSign(req)) {
            return;
        }

        userId = decAndEncHelper.decryptByserverPrivateKey(userId);
  /*      if(paramUtility.isEnpty(userId)) {
            resJson = {
                "data": {},
                "msg": "用户名为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        }*/

        var query = new AV.Query('Vitae');
        query.find().then(function (results) {
            if(!paramUtility.isEnpty(results) && results.length > 0) {
                resUtils.resWithData(res, results[0], "", errorUtils.successCode);
            } else {
                resUtils.resWithData(res, {}, "没有数据", errorUtils.noData);
            }
        }, function (error) {
            resUtils.resWithData(res, {}, error.message, error.code);
        });
    });

    app.post('/blog/getInfo', function (req, res) {

        var query = new AV.Query('BlogInfo');
        query.find().then(function (results) {
            if(!paramUtility.isEnpty(results) && results.length > 0) {
                resUtils.resWithData(res, results, "", errorUtils.successCode);
            } else {
                resUtils.resWithData(res, {}, "没有数据", errorUtils.noData);
            }
        }, function (error) {
            resUtils.resWithData(res, {}, error.message, error.code);
        });

    });

};