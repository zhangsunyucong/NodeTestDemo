'use strict'

var AV = require('leanengine');

var leanCloudUtils = {
    "getLeanCloudClass": function (leanCloudClass) {
        return AV.Object.extend(leanCloudClass);
    }
};

module.exports = {
    leanCloudUtils: leanCloudUtils
};