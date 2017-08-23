/**
 * Created by hyj on 2017/8/4 0004.
 */
'use strict';
exports.bind = function(app) {
    //注册用户接口
   // require('../api/user/userLoginApi.js').loginApi(app);
    require('./user/userRegisterApi.js').userRegisterApi(app);
    require('./user/userLoginApi.js').userLoginApi(app);
    require('./vitae/vitaeApi.js').vitaeApi(app);
    require('./update/SettingApi.js').settingApi(app);
    require('./uploadApi.js').upload(app);

};

