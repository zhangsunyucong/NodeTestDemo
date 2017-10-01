'use strict'

var paramUtility = require('./paramsTypeUtils.js').paramTypeUtility;
var md5 = require('./md5.js');
var decAndEncConfig = require('./decAndEncConfig.js').decAndEncConfig;
var aesUtils = require('./aes.js').AESUtils;
var rsa = require('node-rsa');
//create RSA-key
var key = new rsa({b: 1024});
var serverPrivateKey = new rsa(decAndEncConfig.getServerPrivateKey());
var clientPublicKey = new rsa(decAndEncConfig.getClientPublicKey());
serverPrivateKey.setOptions({encryptionScheme: 'pkcs1'});
clientPublicKey.setOptions({encryptionScheme: 'pkcs1'});

exports.decAndEncHelper = {
    valideReqSign: function (req) {

        var sourceSign = req.body.sign;
        var signString = req.body.signString;
        var key = req.body.aesKey;


        if(paramUtility.isEnpty(key)
            || paramUtility.isEnpty(sourceSign)
            || paramUtility.isEnpty(signString)) {
            return false;
        }

        key = serverPrivateKey.decrypt(key,  'utf-8');
        signString = aesUtils.AESDec(key, signString);
        signString = signString + "appId=" + decAndEncConfig.getAppId();

        var localSign = aesUtils.AESEnc(key, signString);

        if(sourceSign !== localSign) {
           var resJson = {
                "data": {},
                "msg": "签名不正确",
                "status": 205
            };
            if(!paramUtility.isNULL(res)) {
                res.end(jsonUtil.josnObj2JsonString(resJson));
            }
            return false;
        }
        return true;
    },
    generateRSAKey: function() {
        console.log("私：\n" +  key.exportKey('private'));
        console.log("公：\n" +  key.exportKey('public'));
    },
    decryptByserverPrivateKey: function(sourceValue) {
        return serverPrivateKey.decrypt(sourceValue, 'utf-8');
    },
    decAndEncConfig: decAndEncConfig,
    md5: md5,
    aesUtils: aesUtils,
    serverPrivateKey: serverPrivateKey,
    clientPublicKey: clientPublicKey
};