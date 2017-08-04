'use strict';
/***************************************************************************************
 功能模块：sqlite3操作模块，此方法依赖sqlite3模块,模块位于node_modules/sqlite3，请确保模块存在
 使用方法：
 方法1(全局)：
 var sqlite3 = require('./lib/db/dbSqlite3.js');
 db=new sqlite3.db_sqlite3('filename');
 db.query('select id,name from table', function (err, rows) {
    if(err){console.log(err.stack);}
    else{console.log(JSON.stringify(rows));}
	db.close();
 });
***************************************************************************************/
var sqlite3 = require('sqlite3').verbose(); //sqlite数据库处理接口
var log = require('./../common/log');

/********************************************************************************
函数名：dbSqlite3
功能：启动一个sqlite3实例，并且连接到指定文件
输入参数: dbfile 文件名
mode （可选参数）连接模式，可选sqlite3.OPEN_READONLY，sqlite3.OPEN_READWRITE和sqlite3.OPEN_CREATE，默认OPEN_READWRITE | OPEN_CREATE
db_connect （可选参数）回调函数，形式function(connErr){}connErr参数在连接成功时为null，否则会传入一个err对象
返回值：无
创建信息：陈昊(2014-06-27)
修改记录：无
审核人：无
*******************************************************************************/

function dbSqlite3(dbfile,mode,cb_connect){
	var _connection=new sqlite3.Database(dbfile,mode,cb_connect);
	/********************************************************************************
	函数名：execSQL
	功能：执行单条没有返回值的查询
	输入参数: sql 查询语句
	callback 回调函数（可选参数）function(connErr){}（回调函数必须要做异常处理）
	返回值：无
	创建信息：陈昊(2014-06-27)
	修改记录：无
	审核人：无
	*******************************************************************************/
	this.execSQL = function(sql,callback) {
		//如果未传入回调函数则使用默认的回调函数(用于报错)
		var _callback = callback || function(connErr){if(connErr){log.error('db_sqlite3.execSQL: ' + sql,connErr);}};
		//执行sql查询
		_connection.exec(sql,_callback);
	};
    /********************************************************************************
	函数名：execSQLParam
	功能：执行单条带参数没有返回值的查询
   	输入参数: sql 查询语句
	param sql参数
	callback 回调函数（可选参数）function(connErr){}（回调函数必须要做异常处理）
	返回值：无
	创建信息：陈昊(2014-06-27)
	修改记录：无
	审核人：无 
	*******************************************************************************/
	this.execSQLParam = function(sql,param,callback) {
		//如果未传入回调函数则使用默认的回调函数(用于报错)
		var _callback = callback || function(connErr){if(connErr){log.error('db_sqlite3.execSQLParam: ' + sql,connErr);}};
		//执行sql查询
		_connection.run(sql,param,_callback);
	};

	/********************************************************************************
	函数名：query
	功能：执行单条数据查询
	输入参数: sql 查询语句
	callback 回调函数（可选参数）function(connErr,rows){}（回调函数必须要做异常处理）
	返回值：无
	创建信息：陈昊(2014-06-27)
	修改记录：无
	使用实例：
	db.query('select id,name from table', function (err, rows) {
		if(err){console.log(err.stack);}
		else{console.log(JSON.stringify(rows));}
		//实现
	});
	审核人：无  
	*******************************************************************************/
	this.query = function(sql,callback){
		//如果未传入回调函数则使用默认的回调函数(用于报错)
		var _callback = callback || function(connErr,rows){if(connErr){log.error('db_sqlite3.query: ' + sql,connErr);}};
		//执行sql查询
		_connection.all(sql,_callback);
    };
	/********************************************************************************
	函数名：queryParam
	功能：执行单条带参数的数据查询
	输入参数: sql 查询语句
	param sql参数
	callback 回调函数（可选参数）function(connErr,rows){}（回调函数必须要做异常处理）
	返回值：无
	创建信息：陈昊(2014-06-27)
	修改记录：无
	使用实例：
	db.query('select id,name from table where a=? and b=?', [param1,param2],function (err, rows) {
		if(err){console.log(err.stack);}
		else{console.log(JSON.stringify(rows));}
		//实现
	});
	审核人：无
	*******************************************************************************/
    this.queryParam = function(sql,param,callback){
		//如果未传入回调函数则使用默认的回调函数(用于报错)
		var _callback = callback || function(connErr,rows){if(connErr){log.error('db_sqlite3.queryParam: ' + sql,connErr);}};
		_connection.all(sql,param,_callback);
    };

    /*******************************************************************************
	函数名：queryEach
	功能：  执行查询，多次调用回调函数，每次返回一行数据
	输入参数：
          sql    sql查询语句
          callback_err_row 回调函数
          callback_complete_err_nrows(可选参数) 查询完成时回调，有两个参数 err 错误码，nrows 行数
	返 回 值：数据库对象
	创建信息：关东（2014-7-03）
	修改信息：无
	*******************************************************************************/
    this.queryEach = function (sql, callback_err_row, callback_complete_err_nrows) {
  		if (callback_complete_err_nrows == null) {
    		_connection.each(sql, callback_err_row );
  		} else {
    		_connection.each(sql, callback_err_row , callback_complete_err_nrows);
  		}
	}

	/********************************************************************************
	函数名：close
	功能：关闭当前数据文件
	输入参数: （可选参数）callback 回调函数（可选参数）function(connErr){}（回调函数必须要做异常处理）
	返回值：无
	创建信息：陈昊(2014-06-27)
	修改记录：无
	审核人：无  
	*******************************************************************************/
	this.close = function(callback){
		//如果未传入回调函数则使用默认的回调函数(用于报错)
		var _callback = callback || function(connErr){if(connErr){log.error('db_sqlite3.close: ' + sql,connErr);}};
		_connection.close(_callback);
    };
}

//导出接口
exports.dbSqlite3=dbSqlite3;
exports.OPEN_READONLY=sqlite3.OPEN_READONLY;
exports.OPEN_READWRITE=sqlite3.OPEN_READWRITE;
exports.OPEN_CREATE=sqlite3.OPEN_CREATE;