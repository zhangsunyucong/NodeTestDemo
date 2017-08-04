/********************************************************************************
 功能模块：获取app信息
 使用方法：
 var appInfo = require('./lib/util/appInfo.js');
======================================================获取app英文名
 appInfo.getAppEName(1,function(err,rows){
    if(err){console.log(err)}
    else{console.log(JSON.stringify(rows));}
    })
 返回的数据格式：[{"AppName":"测试","AppEName":"CS"}]
======================================================获取appID
 appInfo.getAppID('CS',function(err,rows){
    if(err){console.log(err)}
    else{console.log(JSON.stringify(rows));}
    })
 返回的数据格式：[{"AppID":1}]
 *******************************************************************************/
'use strict';
var db = require('../db/db_mysql.js').G_DB;
var log = require('../common/log.js');

/********************************************************************************
 函数名：getAppEName
 功能：查询app的英文名称
 输入参数: appID app的ID编号
 callback 回调函数function(err,rows){}（回调函数必须要做异常处理）
 返回值：无
 创建信息：谢建沅(2014-06-16)
 修改记录：无
 审 查 人：黎萍（2014-06-24） 
 *******************************************************************************/
exports.getAppEName = function(appID,callback){
    var _callback = callback || function(err,rows){
        if (err) { log.error('appInfo.getAppEName:' + appID, err); }
    };
    var sql_data = [appID];
    var sql = 'select AppName,AppEName from appinfo where AppID = ?';

    db.queryParam(sql, sql_data, _callback);
};

/********************************************************************************
 函数名：getAppID
 功能：查询app的ID
 输入参数: appEName app的英文名称
 callback 回调函数function(err,rows){}（回调函数必须要做异常处理）
 返回值：无
 创建信息：谢建沅(2014-06-16)
 修改记录：无
 审 查 人：黎萍（2014-06-24） 
 *******************************************************************************/
exports.getAppID = function(appEName,callback){
    var _callback = callback || function(err,rows){
        if (err) { log.error('appInfo.getAppID:' + appEName, err); }
    };
    var sql_data = [appEName];
    var sql = 'select AppID from appinfo where AppEName = ?';

    db.queryParam(sql, sql_data, _callback);
};


