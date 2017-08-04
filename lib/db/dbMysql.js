/********************************************************************************
功能模块：mysql操作模块，此方法依赖mysql模块,模块位于node_modules/mysql，请确保模块存在
使用方法：
方法1(全局)：
var db = require('./lib/db/newPoolMysql.js').G_DB;
db.query('select * from table', function (err, result) {
if(err){consol.log(err.stack);}
else{consol.log(JSON.stringify(result));}
});
*******************************************************************************/
'use strict';
var mysql = require('mysql');
var queues = require("mysql-queues"); //引用mysql-queues模块
var async = require('async'); //引用async模块
var log = require('./../common/log');

//全局静态实例
//var G_DB = new dbMysql('192.168.0.23', 'root', 'root', 'maindb', 100);
//var G_DB = new dbMysql('192.168.0.23', 'root', 'root', 'maindb_2017.7.06.16.58', 100);
var G_DB = new dbMysql('192.168.0.23', 'root', 'root', 'maindb', 100);

exports.G_DB = G_DB;
//当需要连接非默认数据库，需要单独实例化一个实例使用
//exports.dbMysql = dbMysql;

function dbMysql(ip, uname, pwd, dbname, connectionLimit) {
    var _connectionLimit = connectionLimit || 10;
    var _pool = mysql.createPool({
        host: ip,
        user: uname,
        password: pwd,
        database: dbname,
        connectionLimit: _connectionLimit
    });
    /********************************************************************************
    函数名：execSQL
    功能：执行单条没有返回值的查询
    输入参数: sql 查询语句
    callback 回调函数（可选参数）function(connErr,result,fields){}（回调函数必须要做异常处理）
    返回值：无
    创建信息：谢建沅(2014-06-11)
    修改记录：无
    审 查 人：黎萍（2014-06-24）
    *******************************************************************************/
    this.execSQL = function (sql, callback) {
        //获得连接池的Connection
        _pool.getConnection(function (poolErr, connection) {
            if (poolErr) {
                //console.error('error dbMysql.execute: ' + sql + ' ,errorMsg: ' + poolErr.stack);
                log.error('dbMysql.execute: ' + sql, poolErr);
                return;
            }
            //如果未传入回调函数则使用默认的回调函数(用于报错)
            var _callback = callback || function (connErr, result, fields) { if (connErr) { log.error('dbMysql.execute: ' + sql, connErr) } };
            //在原回调函数的基础上加入释放连接方法，提高效率
            var _releaseCallback = function (connErr, result, fields) {
                _callback(connErr, result, fields);
                connection.release();
            };
            //执行sql查询
            connection.query(sql, _releaseCallback);
        });
    }
    /********************************************************************************
    函数名：execSQLParam
    功能：执行单条带参数没有返回值的查询
    输入参数: sql 查询语句
    param sql参数
    callback 回调函数（可选参数）function(connErr,result,fields){}（回调函数必须要做异常处理）
    返回值：无
    创建信息：谢建沅(2014-06-11)
    修改记录：无
    审 查 人：黎萍（2014-06-24）
    *******************************************************************************/
    this.execSQLParam = function (sql, param, callback) {
        //获得连接池的Connection
        _pool.getConnection(function (poolErr, connection) {
            if (poolErr) {
                log.error('dbMysql.executeParam: ' + sql, poolErr);
                return;
            }
            //如果未传入回调函数则使用默认的回调函数(用于报错)
            var _callback = callback || function (connErr, result, fields) { if (connErr) { log.error('dbMysql.executeParam: ' + sql, connErr) } };
            //在原回调函数的基础上加入释放连接方法，提高效率
            var _releaseCallback = function (connErr, result, fields) {
                _callback(connErr, result, fields);
                connection.release();
            };
            //执行sql查询
            connection.query(sql, param, _releaseCallback);

        });
    }

    /********************************************************************************
    函数名：query
    功能：执行单条数据查询
    输入参数: sql 查询语句
    callback 回调函数（可选参数）function(connErr,result,fields){}（回调函数必须要做异常处理）
    返回值：无
    创建信息：谢建沅(2014-06-11)
    修改记录：无
    审 查 人：黎萍（2014-06-24）
    *******************************************************************************/
    this.query = function (sql, callback) {
        //获得连接池的Connection
        _pool.getConnection(function (poolErr, connection) {
            if (poolErr) {
                log.error('dbMysql.query: ' + sql, poolErr);
                return;
            }
            //如果未传入回调函数则使用默认的回调函数(用于报错)
            var _callback = callback || function (connErr, result, fields) { if (connErr) { log.error('dbMysql.query: ' + sql, connErr) } };
            //在原回调函数的基础上加入释放连接方法，提高效率
            var _releaseCallback = function (connErr, result, fields) {
                _callback(connErr, result, fields);
                connection.release();
            };
            //执行sql查询
            connection.query(sql, _releaseCallback);

        });
    }
    /********************************************************************************
    函数名：queryParam
    功能：执行单条带参数的数据查询
    输入参数: sql 查询语句
    param sql参数
    callback 回调函数（可选参数）function(connErr,result,fields){}（回调函数必须要做异常处理）
    返回值：无
    创建信息：谢建沅(2014-06-11)
    修改记录：无
    审 查 人：黎萍（2014-06-24）
    *******************************************************************************/
    this.queryParam = function (sql, param, callback) {
        //获得连接池的Connection
        _pool.getConnection(function (poolErr, connection) {
            if (poolErr) {
                log.error('dbMysql.queryParam: ' + sql, poolErr);
                return;
            }
            //如果未传入回调函数则使用默认的回调函数(用于报错)
            var _callback = callback || function (connErr, result, fields) { if (connErr) { log.error('dbMysql.queryParam: ' + sql, connErr) } };
            //在原回调函数的基础上加入释放连接方法，提高效率
            var _releaseCallback = function (connErr, result, fields) {
                _callback(connErr, result, fields);
                connection.release();
            };
            //执行sql查询
            connection.query(sql, param, _releaseCallback);

        });
    }
    /********************************************************************************
    函数名：execSQLTrans
    功能：用事物执行一组sql数组
    输入参数: sqlArr sql数组
    callback 回调函数（可选参数）function(err, info){}（回调函数必须要做异常处理）
    返回值：无
    创建信息：谢建沅(2014-06-11)
    修改记录：无
    审 查 人：黎萍（2014-06-24）
    *******************************************************************************/
    this.execSQLTrans = function (sqlArr, callback) {
        //从连接池获取connection
        _pool.getConnection(function (poolErr, connection) {
            if (poolErr) {
                log.error('dbMysql.execSQLTrans ' + sql, poolErr);
                return;
            } //else{
            queues(connection);
            var trans = connection.startTransaction();
            async.eachSeries(sqlArr, function (sql, asyncCallback) {
                trans.query(sql, function (err, res) {
                    asyncCallback(err, res);
                });
            }, function (err) {
                if (err) {
                    log.error('dbMysql.execSQLTrans', err);
                    //失败回滚
                    trans.rollback();
                    //释放连接
                    connection.release();
                    return;
                } //else {
                //如果未传入回调函数则使用默认的回调函数(用于报错)
                var _callback = callback || function (err, info) { if (connErr) { log.error('dbMysql.execSQLTrans', connErr) } };
                //在原回调函数的基础上加入释放连接方法，提高效率
                var _releaseCallback = function (err, info) {
                    _callback(err, info);
                    connection.release();
                };
                //提交事务
                trans.commit(_releaseCallback);
                //}
            });
            trans.execute();
            //            }
        });
    }

}
