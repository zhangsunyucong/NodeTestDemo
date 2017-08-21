'use strict'

var paramUtility = require('./paramsTypeUtils.js').paramTypeUtility;
var decAndEncHelper = require('./decAndEncHelper.js').decAndEncHelper;
var decAndEncConfig = require('./decAndEncConfig.js').decAndEncConfig;
var jsonUtil = require('../common/json.js');

exports.resUtils = {
    resWithData: function (res, data, msg, status) {
        var resJson;
        if(paramUtility.isNULL(res)) {
            resJson = {
                "data": data,
                "msg": "res 不能为空啦",
                "status": 210
            };
            res.end(decAndEncHelper.aesUtils.AESEnc(decAndEncConfig.getAppScrect(),
                jsonUtil.josnObj2JsonString(resJson)));
            return;
        }
        resJson = {
            "data": data,
            "msg": msg,
            "status": status
        };decAndEncHelper.getA
        res.end(decAndEncHelper.aesUtils.AESEnc(decAndEncConfig.getAppScrect(),
            jsonUtil.josnObj2JsonString(resJson)));
    }
};