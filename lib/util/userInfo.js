/********************************************************************************
 功能模块：获取user信息
 使用方法：
 var userInfo = require('./lib/util/userInfo.js');
 ======================================================获取用户名称
 userInfo.getUserName(1,function(err,rows){
    if(err){console.log(err)}
    else{console.log(JSON.stringify(rows));}
    })
 返回的数据格式：[{"UserName":"13111111111"}]
 ======================================================获取appID
 userInfo.getUserID('13111111111',function(err,rows){
    if(err){console.log(err)}
    else{console.log(JSON.stringify(rows));}
    })
 返回的数据格式：[{"UserID":1}]
 *******************************************************************************/
'use strict';
var db = require('../db/db_mysql.js').G_DB;
var log = require('../common/log.js');

/********************************************************************************
 函数名：getUserName
 功能：查询用户名称
 输入参数: userID 用户的ID编号
 callback 回调函数function(err,rows){}（回调函数必须要做异常处理）
 返回值：无
 创建信息：谢建沅(2014-06-16)
 修改记录：无
 审 查 人：黎萍（2014-06-24） 
 *******************************************************************************/
exports.getUserName = function(userID,callback){
    var _callback = callback || function(err,rows){
        if (err) { log.error('userInfo.getUserName:' + userID, err); }
    };
    var sql_data = [userID];
    var sql = 'select UserName from users where UserID = ?';

    db.queryParam(sql, sql_data, _callback);
};

/********************************************************************************
 函数名：getUserID
 功能：查询用户的ID
 输入参数: userName 用户名称
 callback 回调函数function(err,rows){}（回调函数必须要做异常处理）
 返回值：无
 创建信息：谢建沅(2014-06-16)
 修改记录：无
 审 查 人：黎萍（2014-06-24） 
 *******************************************************************************/
exports.getUserID = function(userName,callback){
    var _callback = callback || function(err,rows){
        if (err) { log.error('userInfo.getUserID:' + userName, err); }
    };
    var sql_data = [userName];
    var sql = 'select UserID from users where UserName = ?';

    db.queryParam(sql, sql_data, _callback);
};


