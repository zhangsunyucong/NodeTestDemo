/**
 * Created by hyj on 2017/8/4 0004.
 */
'use strict';
exports.bind = function(app) {
    //注册用户接口
   // require('../api/user/userLoginApi.js').loginApi(app);
    require('./user/userService.js').userLoginApi(app);

};

