'use strict';
/***************************************************************************************
创建信息：欧聪(2014-7-1)
文件功能：本脚本主要功能是从指定的sqlite数据库文件读取章节试题,并返回试题JSON
说明：
1、文件中多处使用命名为loopFunc的特殊函数，该函数利用闭包和回调的特性来实现异步循环功能，以替代无法实现异步循环的for语句该结构也可用于其它需要实现异步循环的地方
2、文件中多处SQL查询语句使用了AS来定义别名，之所以使用别名，是因为SQL对大小写不敏感而JavaScript对大小写敏感为了避免由于SQL的列名大小写不符而导致JavaScript无法正确获取数据，所以在这里使用了别名
3、除了唯一对外接口dbFile2ChaperTest，其它函数接口都以d2c开头，d2c是dbFileToChapterTest的缩写，写全的话函数名称就太长了
***************************************************************************************/
var mysql = require('../../lib/db/dbMysql.js').G_DB; //mysql公共接口
var json = require('../../lib/common/json.js'); //JSON处理公共接口
var sqlite3 = require('../../lib/db/dbSqlite3'); //sqlite数据库处理接口
var async = require('async'); //同步库
var ASSERT = console.assert;
var log = require('../../lib/common/log.js');

/********************************************************
函数名：dbFile2TestJson
功能：生成题目JSON
输入参数:
appEName 指定的数据库文件名
dbFile   数据库路径名
arrTests 题目数组，格式为：[allTestID:{},childTableID:{},styleID:{},cptID:{},sbjID:{},srcID{}]
callback 回调函数，用来返回试题JSON
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 无
********************************************************/
var getTestFromSQLite = function (appEName,dbFile, arrTests, callback) {
    var dbSqlite; //sqlite3数据库操作接口
    var arrStyles = []; //题型数组

    //打开数据库 
    dbSqlite = new sqlite3.dbSqlite3(dbFile,  function (err) {
        if (err) {
            log.error('打开数据库失败！', err);
            callback({});
            return;
        }
        //生成题型数组
        dbSqlite.query('select StyleID as sid,Style as sty,Explain as exp,Score as sco,Type as typ,SubType as subt from Style', function (err, rows) {
            if (err) {
                log.error('error 103:' + appEName + '[Style]', err);//'error 103:' + dbFile + '[Style](' + err + ')'
                callback({});
                return;
            }
            var typeFunctions = {
                "ATEST": d2cJsonA,
                "XTEST": d2cJsonX,
                "PDTEST": d2cJsonPD,
                "TKTEST": d2cJsonTK,
                "JDTEST": d2cJsonJD,
                "A3TEST": d2cJsonA3,
                "BTEST": d2cJsonB,
                "SWTEST": d2cJsonSW
            };
            var objTestJson = { //用户试题JSON
                "ReturnMessage": "取数据成功",
                "APPEName": appEName,
                "GenDate": (new Date()).toDateString(), //new Date().Format('yyyy/MM/dd'), 
                "StyleItems": []
            };
            //填充试题JSON
            var loopFunc = function (i) {
                if (i < rows.length) {
                    //遍历题型数组
                    var idx = rows[i].sid;
                    arrStyles[idx] = {};
                    arrStyles[idx].StyleID = rows[i].sid;
                    arrStyles[idx].Style = rows[i].sty;
                    arrStyles[idx].Explain = rows[i].exp;
                    arrStyles[idx].Score = rows[i].sco;
                    arrStyles[idx].Type = rows[i].typ.toUpperCase();
                    arrStyles[idx].SubType = rows[i].subt;
                    //拼接SQL语句字符串
                    arrStyles[idx].SqlPlus = jointSqlPlus(arrTests, idx);
                    //设置对应的函数
                    typeFunctions[arrStyles[idx].Type](dbSqlite, arrStyles[idx], objTestJson, function () {
                        loopFunc(i + 1);
                    });
                } else {
                    //关闭数据库连接
                    dbSqlite.close();
                    //返回试题JSON
                    callback(objTestJson);
                }
            };
            loopFunc(0);//开始遍历
        });
    }); //打开源数据库文件,连接源数据库

    

};
/********************************************************
函数名：jointSqlPlus
功能：拼接对应类型试题ID
输入参数:arrTests 试题数组
         stylesId 当前循环的试题类型id
返回值：sqlPlus 拼接的试题ID
创建信息：欧聪(2014-7-3)
修改信息: 无
********************************************************/
function jointSqlPlus(arrTests, styleId) {
    var sqlPlus = '';
    var i;
    for (i = 0; i < arrTests.length - 1; i++) {
        if (arrTests[i].StyleID === styleId) {
            if (arrTests[i].childTableID === -1) {
                sqlPlus += arrTests[i].AllTestID + ',';
            } else {
                sqlPlus += arrTests[i].ChildTableID + ',';
            }
        }
    }
    if (i < arrTests.length) {
        if (arrTests[i].StyleID === styleId) {
            if (arrTests[i].ChildTableID === -1) {
                sqlPlus += arrTests[i].AllTestID;
            } else {
                sqlPlus += arrTests[i].ChildTableID;
            }
        }
    }
    return sqlPlus;
}

/********************************************************
函数名：d2cJsonA
功能：读取指定章节的A型题,生成JSON
输入参数:
dbSqlite SQL操作接口
idxStyle 当前循环的题型JSON数据
objJson 需要操作的注册用户JSON,最终数据就存在这个JSON里
callback 操作结束时调用的回调函数，无参
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 欧聪(2014-7-3) 修改传递的参数
********************************************************/
var d2cJsonA = function (dbSqlite, idxStyle, objJson, callback) {

    if (idxStyle.SqlPlus === '') {//为空时调用回调并返回
        callback();
        return;
    }
    var szSQL = 'SELECT a.ATestID AS aid,b.CptID AS cpid,b.SbjID AS sbjid, b.SrcID AS srcid, b.AllTestID AS allid,a.MainTitle AS title,b.TestPoint AS tp,c.Explain AS exp,a.ItemNum AS nn,a.Answer AS ans,A,B,C,D,E,F FROM ATest a INNER JOIN AllTest b ON ATestID = b.TableID and b.TableName = "ATEST" and b.AllTestid in(' + idxStyle.SqlPlus + ') LEFT JOIN Explain c ON b.EplID = c.Eplid';
    dbSqlite.query(szSQL, function (err, rows) {
        if (err) {
            log.error('error 103:[ATest]', err);
            callback();
            return; 
        }
        if (rows.length <= 0) { //没有数据时调用回调并返回
            callback();
            return;
        }
        //在现有StylesItems的的后面创建一个新JSON
        var idx = objJson.StyleItems.length;
        objJson.StyleItems[idx] = {};
        var subJson = objJson.StyleItems[idx];
        //填充类型数据
        subJson.StyleID = idxStyle.StyleID;
        subJson.Style = idxStyle.Style;
        subJson.Explain = idxStyle.Explain;
        subJson.Score = idxStyle.Score;
        subJson.Type = idxStyle.Type;
        subJson.TestCount = rows.length;
        subJson.TestItems = [];
        //遍历并赋值
        var szSelected = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
        for (var i = 0; i < rows.length; i++) {
            subJson.TestItems[i] = {}; //创建一个TestItem的JSON
            subJson.TestItems[i].ATestID = rows[i].aid;
            subJson.TestItems[i].AllTestID = rows[i].allid;
            subJson.TestItems[i].Title = rows[i].title;
            subJson.TestItems[i].Explain = (rows[i].exp === null) ? '' : rows[i].exp;
            subJson.TestItems[i].TestPoint = (rows[i].tp === null) ? '' : rows[i].tp;
            subJson.TestItems[i].Answer = rows[i].ans;
            subJson.TestItems[i].IsFav = 0;
            subJson.TestItems[i].UserNoteContent = '';
            subJson.TestItems[i].CptID = rows[i].cpid;
            subJson.TestItems[i].SbjID = rows[i].sbjid;
            subJson.TestItems[i].SrcID = rows[i].srcid;
            subJson.TestItems[i].SelectedItems = [];
            //根据选项数量读取数据并设置对应的SelectedItems
            for (var j = 0; j < rows[i].nn; j++) {
                subJson.TestItems[i].SelectedItems[j] = {};
                subJson.TestItems[i].SelectedItems[j].ItemName = szSelected[j];
                subJson.TestItems[i].SelectedItems[j].Content = rows[i][szSelected[j]];
            }
        }
        callback();
    });
};
/********************************************************
函数名：d2cJsonX
功能：读取指定章节的X型题,生成JSON
输入参数:
dbSqlite SQL操作接口
 idxStyle 当前循环的题型JSON数据
objJson 需要操作的注册用户JSON,最终数据就存在这个JSON里
callback 操作结束时调用的回调函数，无参
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 无
********************************************************/
var d2cJsonX = function (dbSqlite, idxStyle, objJson, callback) {
    if (idxStyle.SqlPlus === '') {//为空时调用回调并返回
        callback();
        return;
    }
    var szSQL = 'SELECT a.XTestID AS xid,b.CptID AS cpid,b.SbjID AS sbjid, b.SrcID AS srcid,b.AllTestID AS allid,a.MainTitle AS title,b.TestPoint AS tp,c.Explain AS exp,a.ItemNum AS nn,a.Answer AS ans,A,B,C,D,E,F FROM XTest a INNER JOIN AllTest b ON XTestID = b.TableID and b.TableName = "XTEST" and b.AllTestid in(' + idxStyle.SqlPlus + ') LEFT JOIN Explain c ON b.EplID = c.Eplid';
    dbSqlite.query(szSQL, function (err, rows) {
        if (err) {
            log.error('error 103:[XTest]', err);
            callback();
            return;
        }
        if (rows.length <= 0) { //没有数据时调用回调并返回
            callback();
            return;
        }
        //在现有StylesItems的的后面创建一个新JSON
        var idx = objJson.StyleItems.length;
        objJson.StyleItems[idx] = {};
        var subJson = objJson.StyleItems[idx];
        //填充类型数据
        subJson.StyleID = idxStyle.StyleID;
        subJson.Style = idxStyle.Style;
        subJson.Explain = idxStyle.Explain;
        subJson.Score = idxStyle.Score;
        subJson.Type = idxStyle.Type;
        subJson.TestCount = rows.length;
        subJson.TestItems = [];
        //遍历并赋值
        var szSelected = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
        for (var i = 0; i < rows.length; i++) {
            subJson.TestItems[i] = {}; //创建一个TestItem的JSON
            subJson.TestItems[i].XTestID = rows[i].xid;
            subJson.TestItems[i].AllTestID = rows[i].allid;
            subJson.TestItems[i].Title = rows[i].title;
            subJson.TestItems[i].Explain = (rows[i].exp === null) ? '' : rows[i].exp;
            subJson.TestItems[i].TestPoint = (rows[i].tp === null) ? '' : rows[i].tp;
            subJson.TestItems[i].Answer = rows[i].ans;
            subJson.TestItems[i].IsFav = 0;
            subJson.TestItems[i].UserNoteContent = '';
            subJson.TestItems[i].CptID = rows[i].cpid;
            subJson.TestItems[i].SbjID = rows[i].sbjid;
            subJson.TestItems[i].SrcID = rows[i].srcid;

            subJson.TestItems[i].SelectedItems = [];
            //根据选项数量读取数据并设置对应的SelectedItems
            for (var j = 0; j < rows[i].nn; j++) {
                subJson.TestItems[i].SelectedItems[j] = {};
                subJson.TestItems[i].SelectedItems[j].ItemName = szSelected[j];
                subJson.TestItems[i].SelectedItems[j].Content = rows[i][szSelected[j]];
            }

        }
        callback();
    });
};
/********************************************************
函数名：d2cJsonPD
功能：读取指定章节的PD型题,生成JSON
输入参数:
dbSqlite SQL操作接口
 idxStyle 当前循环的题型JSON数据
objJson 需要操作的注册用户JSON,最终数据就存在这个JSON里
callback 操作结束时调用的回调函数，无参
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 无
********************************************************/
var d2cJsonPD = function (dbSqlite, idxStyle, objJson, callback) {
    if (idxStyle.SqlPlus === '') {//为空时调用回调并返回
        callback();
        return;
    }
    var szSQL = 'SELECT a.PDTestID AS pdid,b.CptID AS cpid,b.SbjID AS sbjid, b.SrcID AS srcid,b.AllTestID AS allid,a.MainTitle AS title,b.TestPoint AS tp,c.Explain AS exp,a.Answer AS ans,A,B from PDTEST a INNER JOIN AllTest b ON PDTestID = b.TableID and b.TableName = "PDTEST" and b.AllTestid in(' + idxStyle.SqlPlus + ') LEFT JOIN Explain c ON b.EplID = c.Eplid';
    dbSqlite.query(szSQL, function (err, rows) {
        if (err) {
            log.error('error 103:[PDTest]', err);
            callback();
            return;
        }
        if (rows.length <= 0) { //没有数据时调用回调并返回
            callback();
            return;
        }
        //在现有StylesItems的的后面创建一个新JSON
        var idx = objJson.StyleItems.length;
        objJson.StyleItems[idx] = {};
        var subJson = objJson.StyleItems[idx];
        //填充类型数据
        subJson.StyleID = idxStyle.StyleID;
        subJson.Style = idxStyle.Style;
        subJson.Explain = idxStyle.Explain;
        subJson.Score = idxStyle.Score;
        subJson.Type = idxStyle.Type;
        subJson.TestCount = rows.length;
        subJson.TestItems = [];
        //遍历并赋值
        for (var i = 0; i < rows.length; i++) {
            subJson.TestItems[i] = {}; //创建一个TestItem的JSON
            subJson.TestItems[i].PDTestID = rows[i].pdid;
            subJson.TestItems[i].AllTestID = rows[i].allid;
            subJson.TestItems[i].Title = rows[i].title;
            subJson.TestItems[i].Explain = (rows[i].exp === null) ? '' : rows[i].exp;
            subJson.TestItems[i].TestPoint = (rows[i].tp === null) ? '' : rows[i].tp;
            subJson.TestItems[i].Answer = rows[i][rows[i].ans];
            subJson.TestItems[i].IsFav = 0;
            subJson.TestItems[i].UserNoteContent = '';
            subJson.TestItems[i].CptID = rows[i].cpid;
            subJson.TestItems[i].SbjID = rows[i].sbjid;
            subJson.TestItems[i].SrcID = rows[i].srcid;

        }
        callback();
    });
};
/********************************************************
函数名：d2cJsonJD
功能：读取指定章节的JD型题,生成JSON
输入参数:
dbSqlite SQL操作接口
idxStyle 当前循环的题型JSON数据
objJson 需要操作的注册用户JSON,最终数据就存在这个JSON里
callback 操作结束时调用的回调函数，无参
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 无
********************************************************/
var d2cJsonJD = function (dbSqlite, idxStyle, objJson, callback) {
    if (idxStyle.SqlPlus === '') {//为空时调用回调并返回
        callback();
        return;
    }
    var szSQL = 'SELECT a.JDTestID AS jdid,b.CptID AS cpid,b.SbjID AS sbjid, b.SrcID AS srcid,b.AllTestID AS allid,a.MainTitle AS title,b.TestPoint AS tp,c.Explain AS exp,a.Answer AS ans from JDTEST a INNER JOIN AllTest b ON JDTestID = b.TableID AND b.TableName = "JDTEST" and b.AllTestid in(' + idxStyle.SqlPlus + ') LEFT JOIN Explain c ON b.EplID = c.Eplid';
    dbSqlite.query(szSQL, function (err, rows) {
        if (err) {
            log.error('error 103:[JDTest]', err);
            callback();
            return;
        }
        if (rows.length <= 0) { //没有数据时调用回调并返回
            callback();
            return;
        }
        //在现有StylesItems的的后面创建一个新JSON
        var idx = objJson.StyleItems.length;
        objJson.StyleItems[idx] = {};
        var subJson = objJson.StyleItems[idx];
        //填充类型数据
        subJson.StyleID = idxStyle.StyleID;
        subJson.Style = idxStyle.Style;
        subJson.Explain = idxStyle.Explain;
        subJson.Score = idxStyle.Score;
        subJson.Type = idxStyle.Type;
        subJson.TestCount = rows.length;
        subJson.TestItems = [];
        //遍历并赋值
        for (var i = 0; i < rows.length; i++) {
            subJson.TestItems[i] = {}; //创建一个TestItem的JSON
            subJson.TestItems[i].JDTestID = rows[i].jdid;
            subJson.TestItems[i].AllTestID = rows[i].allid;
            subJson.TestItems[i].Title = rows[i].title;
            subJson.TestItems[i].Explain = (rows[i].exp === null) ? '' : rows[i].exp;
            subJson.TestItems[i].TestPoint = (rows[i].tp === null) ? '' : rows[i].tp;
            subJson.TestItems[i].Answer = rows[i].ans;
            subJson.TestItems[i].IsFav = 0;
            subJson.TestItems[i].UserNoteContent = '';
            subJson.TestItems[i].CptID = rows[i].cpid;
            subJson.TestItems[i].SbjID = rows[i].sbjid;
            subJson.TestItems[i].SrcID = rows[i].srcid;

        }
        callback();
    });
};
/********************************************************
函数名：d2cJsonTK
功能：读取指定章节的TK型题,生成JSON
输入参数:
dbSqlite SQL操作接口
idxStyle 当前循环的题型JSON数据
objJson 需要操作的注册用户JSON,最终数据就存在这个JSON里
callback 操作结束时调用的回调函数，无参
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 无
********************************************************/
var d2cJsonTK = function (dbSqlite, idxStyle, objJson, callback) {
    if (idxStyle.SqlPlus === '') {//为空时调用回调并返回
        callback();
        return;
    }
    var szSQL = 'SELECT a.TKTestID AS tkid,b.CptID AS cpid,b.SbjID AS sbjid, b.SrcID AS srcid,b.AllTestID AS allid,a.MainTitle AS title,b.TestPoint AS tp,c.Explain AS exp,a.Answer AS ans FROM TKTEST a INNER JOIN AllTest b ON TKTestID = b.TableID AND b.TableName = "TKTEST" and b.AllTestid in(' + idxStyle.SqlPlus + ') LEFT JOIN Explain c ON b.EplID = c.Eplid';
    dbSqlite.query(szSQL, function (err, rows) {
        if (err) {
            log.error('error 103:[TKTest]', err);
            callback();
            return;
        }
        if (rows.length <= 0) { //没有数据时调用回调并返回
            callback();
            return;
        }
        //在现有StylesItems的的后面创建一个新JSON
        var idx = objJson.StyleItems.length;
        objJson.StyleItems[idx] = {};
        var subJson = objJson.StyleItems[idx];
        //填充类型数据
        subJson.StyleID = idxStyle.StyleID;
        subJson.Style = idxStyle.Style;
        subJson.Explain = idxStyle.Explain;
        subJson.Score = idxStyle.Score;
        subJson.Type = idxStyle.Type;
        subJson.TestCount = rows.length;
        subJson.TestItems = [];
        //遍历并赋值
        for (var i = 0; i < rows.length; i++) {
            subJson.TestItems[i] = {}; //创建一个TestItem的JSON
            subJson.TestItems[i].TKTestID = rows[i].tkid;
            subJson.TestItems[i].AllTestID = rows[i].allid;
            subJson.TestItems[i].Title = rows[i].title;
            subJson.TestItems[i].Explain = (rows[i].exp === null) ? '' : rows[i].exp;
            subJson.TestItems[i].TestPoint = (rows[i].tp === null) ? '' : rows[i].tp;
            subJson.TestItems[i].Answer = rows[i].ans;
            subJson.TestItems[i].IsFav = 0;
            subJson.TestItems[i].UserNoteContent = '';
            subJson.TestItems[i].CptID = rows[i].cpid;
            subJson.TestItems[i].SbjID = rows[i].sbjid;
            subJson.TestItems[i].SrcID = rows[i].srcid;

        }
        callback();
    });
};
/********************************************************
函数名：d2cJsonA3
功能：读取指定章节的A3型题,生成JSON
输入参数:
dbSqlite SQL操作接口
idxStyle 当前循环的题型JSON数据
objJson 需要操作的注册用户JSON,最终数据就存在这个JSON里
callback 操作结束时调用的回调函数，无参
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 无
********************************************************/
var d2cJsonA3 = function (dbSqlite, idxStyle, objJson, callback) {
    if (idxStyle.SqlPlus === '') {//为空时调用回调并返回
        callback();
        return;
    }
    var szSQL = 'SELECT a.A3TestID AS a3id,b.CptID AS cpid,b.SbjID AS sbjid, b.SrcID AS srcid,b.AllTestID AS allid,a.FrontTitle AS title,b.TestPoint AS tp,c.Explain as exp,d.A3TestItemID as sid,d.MainTitle as stitle,e.Explain as sexp,d.ItemNum as nn,Answer as ans,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O FROM A3TEST a INNER JOIN AllTest b ON a.A3TestID = b.TableID AND b.TableName = "A3TEST" LEFT JOIN Explain c ON b.EplID = c.Eplid INNER JOIN A3TestItem d ON d.A3TestID=a.A3TestID and d.A3TestItemID in(' + idxStyle.SqlPlus + ') LEFT JOIN Explain e ON d.EplID = e.Eplid';
    dbSqlite.query(szSQL, function (err, rows) {
        if (err) {
            log.error('error 103:[A3Test]', err);
            callback();
            return;
        }
        if (rows.length <= 0) { //没有数据时调用回调并返回
            callback();
            return;
        }
        //在现有StylesItems的的后面创建一个新JSON
        var idx = objJson.StyleItems.length;
        objJson.StyleItems[idx] = {};
        var subJson = objJson.StyleItems[idx];
        //填充类型数据
        subJson.StyleID = idxStyle.StyleID;
        subJson.Style = idxStyle.Style;
        subJson.Explain = idxStyle.Explain;
        subJson.Score = idxStyle.Score;
        subJson.Type = idxStyle.Type;
        subJson.SubType = (idxStyle.SubType === '') ? '单项' : idxStyle.SubType;
        subJson.TestCount = rows.length;
        subJson.TestItems = [];
        //遍历并赋值
        var szSelected = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
        var curA3ID = -1; //当前操作的A3大题ID
        var idxA3 = -1; //操作的A3大题索引
        var idxSub; //操作的A3小题索引
        for (var i = 0; i < rows.length; i++) {
            if (curA3ID !== rows[i].a3id) {
                idxA3++;
                subJson.TestItems[idxA3] = {}; //创建一个TestItem的JSON
                subJson.TestItems[idxA3].A3TestID = rows[i].a3id;
                subJson.TestItems[idxA3].AllTestID = rows[i].allid;
                subJson.TestItems[idxA3].FrontTitle = rows[i].title;
                subJson.TestItems[idxA3].Explain = (rows[i].exp === null) ? '' : rows[i].exp;
                subJson.TestItems[idxA3].TestPoint = (rows[i].tp === null) ? '' : rows[i].tp;
                subJson.TestItems[idxA3].IsFav = 0;
                subJson.TestItems[idxA3].UserNoteContent = '';
                subJson.TestItems[i].CptID = rows[i].cpid;
                subJson.TestItems[i].SbjID = rows[i].sbjid;
                subJson.TestItems[i].SrcID = rows[i].srcid;

                subJson.TestItems[idxA3].A3TestItems = [];
                idxSub = 0;
                curA3ID = rows[i].a3id;
            }
            subJson.TestItems[idxA3].A3TestItems[idxSub] = {};
            subJson.TestItems[idxA3].A3TestItems[idxSub].A3TestItemID = rows[i].sid;
            subJson.TestItems[idxA3].A3TestItems[idxSub].Title = rows[i].stitle;
            subJson.TestItems[idxA3].A3TestItems[idxSub].Answer = rows[i].ans;
            subJson.TestItems[idxA3].A3TestItems[idxSub].Explain = (rows[i].sexp === null) ? '' : rows[i].sexp;;
            subJson.TestItems[idxA3].A3TestItems[idxSub].TestPoint = '';
            subJson.TestItems[idxA3].A3TestItems[idxSub].SelectedItems = [];
            //根据选项数量读取数据并设置对应的SelectedItems
            for (var j = 0; j < rows[i].nn; j++) {
                subJson.TestItems[idxA3].A3TestItems[idxSub].SelectedItems[j] = {};
                subJson.TestItems[idxA3].A3TestItems[idxSub].SelectedItems[j].ItemName = szSelected[j];
                subJson.TestItems[idxA3].A3TestItems[idxSub].SelectedItems[j].Content = rows[i][szSelected[j]];
            }
            idxSub++;
        }
        callback();
    });
};

/********************************************************
函数名：d2cJsonB
功能：读取指定章节的B型题,生成JSON
输入参数:
dbSqlite SQL操作接口
idxStyle 当前循环的题型JSON数据
objJson 需要操作的注册用户JSON,最终数据就存在这个JSON里
callback 操作结束时调用的回调函数，无参
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 无
********************************************************/
var d2cJsonB = function (dbSqlite, idxStyle, objJson, callback) {
    if (idxStyle.SqlPlus === '') {//为空时调用回调并返回
        callback();
        return;
    }
    var szSQL = 'SELECT a.BTestID AS bid,b.CptID AS cpid,b.SbjID AS sbjid, b.SrcID AS srcid,b.AllTestID AS allid,b.TestPoint AS tp,c.Explain AS exp,a.ItemNum AS nn,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,d.BTestItemID as sid,d.BTitle as stitle,d.Answer as ans,e.Explain as sexp FROM BTEST a INNER JOIN AllTest b ON a.BTestID = b.TableID AND b.TableName = "BTEST"  LEFT JOIN Explain c ON b.EplID = c.Eplid INNER JOIN BTestItem d ON d.BTestID = a.BTestID and d.BTestItemID in(' + idxStyle.SqlPlus + ') LEFT JOIN Explain e ON d.EplID = e.Eplid';
    dbSqlite.query(szSQL, function (err, rows) {
        if (err) {
            log.error('error 103:[BTest]', err);
            callback();
            return;
        }
        if (rows.length <= 0) { //没有数据时调用回调并返回
            callback();
            return;
        }
        //在现有StylesItems的的后面创建一个新JSON
        var idx = objJson.StyleItems.length;
        objJson.StyleItems[idx] = {};
        var subJson = objJson.StyleItems[idx];
        //填充类型数据
        subJson.StyleID = idxStyle.StyleID;
        subJson.Style = idxStyle.Style;
        subJson.Explain = idxStyle.Explain;
        subJson.Score = idxStyle.Score;
        subJson.Type = idxStyle.Type;
        subJson.SubType = (idxStyle.SubType === '') ? '单项' : idxStyle.SubType;
        subJson.TestCount = rows.length;
        subJson.TestItems = [];
        //遍历并赋值
        var szSelected = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
        var curBID = -1; //当前操作的A3大题ID
        var idxB = -1; //操作的B大题索引
        var idxSub; //操作的B小题索引
        for (var i = 0; i < rows.length; i++) {
            if (curBID !== rows[i].bid) {
                idxB++;
                subJson.TestItems[idxB] = {}; //创建一个TestItem的JSON
                subJson.TestItems[idxB].BTestID = rows[i].bid;
                subJson.TestItems[idxB].AllTestID = rows[i].allid;
                subJson.TestItems[idxB].Explain = (rows[i].exp === null) ? '' : rows[i].exp;
                subJson.TestItems[idxB].TestPoint = (rows[i].tp === null) ? '' : rows[i].tp;
                subJson.TestItems[idxB].IsFav = 0;
                subJson.TestItems[idxB].UserNoteContent = '';
                subJson.TestItems[i].CptID = rows[i].cpid;
                subJson.TestItems[i].SbjID = rows[i].sbjid;
                subJson.TestItems[i].SrcID = rows[i].srcid;

                subJson.TestItems[idxB].SelectedItems = [];
                //根据选项数量读取数据并设置对应的SelectedItems
                for (var j = 0; j < rows[i].nn; j++) {
                    subJson.TestItems[idxB].SelectedItems[j] = {};
                    subJson.TestItems[idxB].SelectedItems[j].ItemName = szSelected[j];
                    subJson.TestItems[idxB].SelectedItems[j].Content = rows[i][szSelected[j]];
                }

                subJson.TestItems[idxB].BTestItems = [];
                idxSub = 0;
                curBID = rows[i].bid;
            }
            subJson.TestItems[idxB].BTestItems[idxSub] = {};
            subJson.TestItems[idxB].BTestItems[idxSub].BTestItemID = rows[i].sid;
            subJson.TestItems[idxB].BTestItems[idxSub].Title = rows[i].stitle;
            subJson.TestItems[idxB].BTestItems[idxSub].Answer = rows[i].ans;
            subJson.TestItems[idxB].BTestItems[idxSub].Explain = (rows[i].sexp === null) ? '' : rows[i].sexp;;
            subJson.TestItems[idxB].BTestItems[idxSub].TestPoint = '';
            idxSub++;
        }
        callback();
    });
};

/********************************************************
函数名：d2cJsonSW
功能：读取指定章节的SW型题,生成JSON
输入参数:
dbSqlite SQL操作接口
idxStyle 当前循环的题型JSON数据
objJson 需要操作的注册用户JSON,最终数据就存在这个JSON里
callback 操作结束时调用的回调函数，无参
返回值：无
创建信息：欧聪(2014-7-1)
修改信息: 无
********************************************************/
var d2cJsonSW = function (dbSqlite, idxStyle, objJson, callback) { //这个题型采取不处理的措施
    callback();
};
//导出接口
module.exports = {
    getTestFromSQLite: getTestFromSQLite
};
