'use strict'

var fs = require('fs');
var multiparty = require('multiparty');
var resUtils = require('../lib/util/responseUtils.js').resUtils;
var AV = require('leanengine');
AV.Cloud.useMasterKey();

exports.upload = function (app) {
    app.post('/upload', function(req, res){
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {files.file.length
            //var iconFile = files.iconImage[0];
           // var fileOne = files.upload[0]
            var iconFile = files.file;
            if(iconFile.size !== 0){
                var file = iconFile[0];

                fs.readFile(file.path, function(err, data){
                    if(err) {
                        return res.end('读取文件失败');
                    }
                    var theFile = new AV.File(file.originalFilename, data);
                    theFile.save().then(function(theFile){JSON.stringify(theFile);
                        //theFile.attributes.url
                        resUtils.resWithData(res, theFile, "上传成功！", 200);
                    }, function (error) {
                        resUtils.resWithData(res, theFile, "上传失败！", 202);
                    });
                });
            } else {
                res.end('请选择一个文件。');
            }
        });
    });
};