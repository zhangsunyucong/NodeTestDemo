/**
 * Created by hyj on 2017/8/4 0004.
 */
var getType = Object.prototype.toString;

//exports.paramTypeUtility = function

var paramTypeUtility = {

    isString: function(param) {
        return typeof v === 'string';
    },

    isNumber: function(param) {
        return typeof v === 'number' && isFinite(v);
    },

    isBoolean: function(param) {
        return typeof v === 'boolean';
    },

    isFunction: function(param) {
        return getType.call(param) === '[object Function]';
    },

    isRegexp: function(param) {
        return getType.call(param) == '[object RegExp]';
    },

    isObject: function(param) {
        return !!param && getType.call(param) == '[object Object]';
    },

    isDate: function(param) {
        return getType.call(param) === '[object Date]';
    },

    isArray: function(param) {
        return getType.call(param) == '[object Array]';
    },

    isNULL: function(param) {
        return getType.call(param) == '[object Null]';
    },

    isEnpty: function(param) {
        return param === null || param === undefined ||
            (this.isArray(param) && !param.length) ||
            (param === '');
    },

    isDocument: function(param) {
        return getType.call(param) == "[object Document]" || '[object HTMLDocument]';
    },

    getParamType: function (param) {
        return getType.call(param);
    }
};

exports.paramTypeUtility = paramTypeUtility;