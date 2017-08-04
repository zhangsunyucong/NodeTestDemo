/**
 * Created by hyj on 2017/8/4 0004.
 */
/**
 * type.js 数据类型检测函数
 * @author 朱辉
 * @email javaee6@qq.com
 * @version 0.1
 */
(function(window, undefined){
    xjo = window.xjo ||
        {
            plugin: {}
        };
    xjo.type = {};
    //检测v的类型 辅助函数
    var type = function(v){
        return Object.prototype.toString.call(v);
    };

    /**
     * 是否为数组对象类型  如果是就返回true 如果不是就返回false
     * @namespace xjo.type
     * @method isArray
     * @param {Any} v 被检测的变量
     * @return {Boolean} 结果
     */
    xjo.type.isArray = function(v){
        return type(v) === '[object Array]';
    };
    /**
     * 是否为参数管理器Arguments 如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    xjo.type.isArguments = function(v){
        return v.callee != undefined;
    };
    /**
     * 是否为迭代序列 包含Array与Arguments 如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    xjo.type.isIterable = function(v){
        return xjo.type.isArray(v) || xjo.type.isArguments(v);
    };
    /**
     * 是否为空对象 null和undefined和数组的长度为0或空字符串("") 如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @param {Boolean} allowBlank [可选] 默认false 空字符串认为是空对象 反之 空字符串不认为是空对象
     * @return {Boolean}
     */
    xjo.type.isEmpty = function(v, allowBlank){
        return v === null || v === undefined ||
            (xjo.type.isArray(v) && !v.length) ||
            (!allowBlank ? v === '' : false);
    };
    /**
     * 是否为字符串类型 如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    xjo.type.isString = function(v){
        return typeof v === 'string';
    };
    /**
     * 是否为数字类型(为Number且不为正负无穷大数字) 如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    xjo.type.isNumber = function(v){
        return typeof v === 'number' && isFinite(v);

    };
    /**
     * 是否为布尔值类型  如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    xjo.type.isBoolean = function(v){
        return typeof v === 'boolean';
    };
    /**
     * 是否为函数类型 如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    xjo.type.isFuntion = function(v){
        return type(v) === '[object Function]';
    };
    /**
     * 是否为对象类型
     * @param {Any} v 被检测的变量
     * @return {boolean}
     */
    xjo.type.isObject = function(v){
        return !!v && type(v) === '[object Object]';
    };
    /**
     * 是否为日期类型  如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {boolean}
     */
    xjo.type.isDate = function(v){
        return type(v) === '[object Date]';
    };
    /**
     * 是否为正则表达式类型  如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    xjo.type.isRegexp = function(v){
        return type(v) == '[object RegExp]';
    };
    /**
     * 是否为原始数据类型 如果是就返回true 如果不是就返回false
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    xjo.type.isPrimitive = function(v){
        return xjo.type.isString(v) || xjo.type.isNumber(v) ||
            xjo.type.isBoolean(v);
    };
    /**
     * 返回数据类型的字符串形式<br>
     *  数字类型:"number" <br>
     *  布尔类型:"boolean" <br>
     *  字符串类型:"string" <br>
     *  数组类型:"array"<br>
     *  日期类型:"date"<br>
     *  正则表达式类型:"regexp" <br>
     *  函数类型:"function"<br>
     *  对象类型:"object"<br>
     *  参数管理器类型:"arguments"<br>
     *  其他类型:"unknow"
     * @param {Any} v 被检测的变量
     * @return {String}
     */
    xjo.type.type = function(v){
        var result = "unknow";
        if (xjo.type.isNumber(v)) {
            result = "number";
        }
        if (xjo.type.isBoolean(v)) {
            result = "boolean";
        }
        if (xjo.type.isString(v)) {
            result = "string";
        }
        if (xjo.type.isArray(v)) {
            result = "array";
        }
        if (xjo.type.isDate(v)) {
            result = "date";
        }
        if (xjo.type.isRegexp(v)) {
            result = "regexp";
        }
        if (xjo.type.isFuntion(v)) {
            result = "function";
        }
        if (xjo.type.isObject(v)) {
            result = "object";
        }
        if (xjo.type.isArguments(v)) {
            result = "argumetns";
        }
        return result;
    };
    xjo.plugin["jo/type"] = true;
})(window);