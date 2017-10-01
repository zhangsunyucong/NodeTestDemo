/**
 * Created by zhangsunyucong on 2017/9/16.
 */
'use strict'

var paramUtility = require('./paramsTypeUtils.js').paramTypeUtility;
var decAndEncHelper = require('./decAndEncHelper.js').decAndEncHelper;
var decAndEncConfig = require('./decAndEncConfig.js').decAndEncConfig;
var jsonUtil = require('../common/json.js');

exports.socketReqAndRes = {
    getSocketRes: function(data, msg, status) {
        var resJson;
        if(!paramUtility.isString(data)) {
            resJson = {
                "data": data,
                "msg": "服务器应该返回正确的json字符串",
                "status": 300
            };
            return decAndEncHelper.aesUtils.AESEnc(decAndEncConfig.getAppScrect(),
                jsonUtil.josnObj2JsonString(resJson));
        }

        resJson = {
            "data": data,
            "msg": msg,
            "status": status
        };
        return decAndEncHelper.aesUtils.AESEnc(decAndEncConfig.getAppScrect(),
            jsonUtil.josnObj2JsonString(resJson))
    },
    getSocketReqStringData: function(data) {
        return decAndEncHelper.aesUtils.AESDec(decAndEncConfig.getChatScrect(), data);
    },
    getSocketJsonStringDecryptRes: function(jsonObj) {
        return decAndEncHelper.aesUtils.AESEnc(decAndEncConfig.getChatScrect(), jsonUtil.josnObj2JsonString(jsonObj));
    }
};