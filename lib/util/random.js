'use strict';
//随机种子数组
var randomSeed = ['0','1','2','3','4','5','6','7','8','9',
'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
//随机数组长度
var seedLen = randomSeed.length-1;

/********************************************************************************
 函数名：getRandom
 功能：获取指定长度的随机字符
 输入参数: length 字符长度
 返回值：string 随机字符
 创建信息：谢建沅(2014-06-26)
 修改记录：无
 审 查 人：无
 *******************************************************************************/
exports.getRandomStr = function (length) {
    length = length || 32;
    var ranStr = "";
    for(var i = 0; i < length ; i ++) {
        var idx = Math.ceil(Math.random()*seedLen);
        ranStr += randomSeed[idx];
    }
    return ranStr;
}
