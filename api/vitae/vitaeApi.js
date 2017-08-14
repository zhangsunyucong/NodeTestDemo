'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;

/***********************************************************************************
 * 创建人：何允俭
 * 创建日期：2017-08-14
 * 功能说明：简历相关功能模块
 ***********************************************************************************/
exports.vitaeApi = function (app) {

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

  /*      if(paramUtility.isEnpty(userId)) {
            resJson = {
                "data": {},
                "msg": "用户名为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        }*/

        var resJson;
        var query = new AV.Query('Vitae');
        query.find().then(function (results) {
            if(!paramUtility.isEnpty(results) && results.length > 0) {
                resJson = {
                    "data": results[0],
                    "msg": "",
                    "status": 200
                };
            } else {
                resJson = {
                    "data": {},
                    "msg": "没有数据",
                    "status": 203
                };
            }

            res.end(jsonUtil.josnObj2JsonString(resJson));
        }, function (error) {
            resJson = {
                "data": {},
                "msg": error.message,
                "status": error.code
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        });
    });

};