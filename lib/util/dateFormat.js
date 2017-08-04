'use strict';

exports.init = function () {
    /********************************************************************************
    函数名：format
    功能：扩展日期类型添加format方法
    输入参数: fmt 格式化规则(例: yyyy/MM/dd hh:mm:ss)
    返回值：无
    创建信息：谢建沅(2014-06-16)
    修改记录：无
    审 查 人：黎萍（2014-06-24） 
    *******************************************************************************/
    Date.prototype.format = function (fmt) { //author: meizz
        var fmtObj = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in fmtObj) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (fmtObj[k]) : (("00" + fmtObj[k]).substr(("" + fmtObj[k]).length)));
            }
        }
        return fmt;
    }
}
