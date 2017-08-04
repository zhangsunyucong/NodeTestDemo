/********************************************************************************
 文件操作模块
 *******************************************************************************/
var fs = require('fs');

/********************************************************************************
 函数名：readFile
 功能：异步读取文件方法
 输入参数: fileName 文件路径('./test.txt')
 encoding 编码格式(可选参数)例：utf-8
 callback：回调函数function (err, data){}
 返回值：无
 创建信息：谢建沅(2014-06-06)
 ===============================================================================
 示例：
 readFile('/etc/passwd', function (err, data) {}); //二进制读取
 readFile('/etc/passwd', 'utf-8', function (err, data) {}); //utf-8编码读取
 *******************************************************************************/
exports.readFile = function(fileName,encoding,callback) {
    //没有传入encoding，当前的encoding是回调函数
    if(callback === undefined && encoding !== undefined && typeof encoding === 'function')
    {
        fs.readFile(fileName,encoding);
    } else{
        fs.readFile(fileName,encoding,callback);
    }

}

/********************************************************************************
 函数名：writeFile
 功能：异步写入文件方法
 输入参数: fileName 文件路径('./test.txt')
 data 数据流(string或者buffer)
 encoding 编码格式(可选参数)，例：utf-8
 返回值：无
 创建信息：谢建沅(2014-06-06)
 修改记录：
 审 查 人：
 示例：
 writeFile('./message.txt',"hello node",'utf-8',function(err){}); //utf-8编码保存
 writeFile('./message.txt',"hello node",,function(err){}); //二进制保存
 *******************************************************************************/
exports.writeFile = function(fileName,data,encoding,callback) {
    //没有传入encoding，当前的encoding是回调函数
    if(callback === undefined && encoding !== undefined && typeof encoding === 'function')
    {
        fs.writeFile(fileName, data, encoding);
    } else{
        fs.writeFile(fileName, data, encoding,callback);
    }

}
