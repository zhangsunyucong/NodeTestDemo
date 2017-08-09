'use strict';

var AV = require('leanengine');
var config = require('./config.js');

AV.init({
  appId: "5ubk617rzfa913c94ffaq8sg6o4tk0rebptuo10yjgd575yx", //process.env.LEANCLOUD_APP_ID ||
  appKey:  'zw9k6etgw25v1tvbvo8vzhndjmrc68k8ryylqpyzs1dd8nc7', //process.env.LEANCLOUD_APP_KEY ||
  masterKey:  "2v4frk769da1sc6zffwg4ff91pt5nu2qlnx2pkcsm8wv7l66" //process.env.LEANCLOUD_APP_MASTER_KEY ||
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

var app = require('./app');

// 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

app.listen(PORT, function (err) {
  console.log('Node app is running on port:', PORT);

  // 注册全局未捕获异常处理器
  process.on('uncaughtException', function(err) {
    console.error('Caught exception:', err.stack);
  });
  process.on('unhandledRejection', function(reason, p) {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
  });
});
