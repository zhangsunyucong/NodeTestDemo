'use strict';

var AV = require('leanengine');
var app = require('./app');
var config = require('./config.js');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketReqAndResUtils = require('./lib/util/socketReqAndResUtils.js').socketReqAndRes;

AV.init({
  appId: "5ubk617rzfa913c94ffaq8sg6o4tk0rebptuo10yjgd575yx", //process.env.LEANCLOUD_APP_ID ||
  appKey:  'zw9k6etgw25v1tvbvo8vzhndjmrc68k8ryylqpyzs1dd8nc7', //process.env.LEANCLOUD_APP_KEY ||
  masterKey:  "2v4frk769da1sc6zffwg4ff91pt5nu2qlnx2pkcsm8wv7l66" //process.env.LEANCLOUD_APP_MASTER_KEY ||
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

// 端口一定要从环境变量 `LEANCLOUD_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
var PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

server.listen(PORT, function (err) {
  console.log('Node app is running on port:', PORT);

  // 注册全局未捕获异常处理器
  process.on('uncaughtException', function(err) {
    console.error('Caught exception:', err.stack);
  });
  process.on('unhandledRejection', function(reason, p) {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
  });
});

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    data = socketReqAndResUtils.getSocketReqStringData(data);
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });

  });

  // when the client emits 'ad11d user', this listens and executes
  socket.on('add user', function (username) {

    username = socketReqAndResUtils.getSocketReqStringData(username);

    if (addedUser) return;

    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
          username: username,
          numUsers: numUsers
        });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});

