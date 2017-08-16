'use strict'

var AV = require('leanengine');
var jsonUtil = require('../../lib/common/json.js');
var leanCloudUtils = require('../leanCloudUtils').leanCloudUtils;
var paramUtility = require('../../lib/util/paramsTypeUtils.js').paramTypeUtility;

/***********************************************************************************
 * 创建人：何允俭
 * 创建日期：2017-08-14
 * 功能说明：简历相关功能模块
 ***********************************************************************************/
exports.vitaeApi = function (app) {

    /***********************************************************************************
     * 创建人：何允俭
     * 创建日期：2017-08-14
     * 功能说明：获取简历的信息
     * 参数说明：userId 用户id
     * 返回值：简历的信息
     * 评审人：
     * 评审时间：
     ***********************************************************************************/
    app.post('/vitae/getInfo', function (req, res) {

        var userId = req.body.userId;

  /*      if(paramUtility.isEnpty(userId)) {
            resJson = {
                "data": {},
                "msg": "用户名为空",
                "status": 202
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        }*/

        var resJson;
        var query = new AV.Query('Vitae');
        query.find().then(function (results) {
            if(!paramUtility.isEnpty(results) && results.length > 0) {
                resJson = {
                    "data": results[0],
                    "msg": "",
                    "status": 200
                };
            } else {
                resJson = {
                    "data": {},
                    "msg": "没有数据",
                    "status": 203
                };
            }

            res.end(jsonUtil.josnObj2JsonString(resJson));
        }, function (error) {
            resJson = {
                "data": {},
                "msg": error.message,
                "status": error.code
            };
            res.end(jsonUtil.josnObj2JsonString(resJson));
        });
    });

    app.post('/blog/getInfo', function (req, res) {
        var infos = [

            {
                "enName": "lmj623565791",
                "cnName": "张鸿洋",
                "motto":  "生命不息，奋斗不止，万事起于忽微，量变引起质变",
                "avatarUrl": "http://avatar.csdn.net/F/F/5/1_lmj623565791.jpg",
                "blogUrl": "http://blog.csdn.net/lmj623565791",
                "blogType": "android"
            },
            {
                "enName": "cyh_24",
                "cnName": "仙道菜",
                "motto":  "计算机视觉、深度学习搬砖工人...",
                "avatarUrl": "http://avatar.csdn.net/4/3/8/1_cyh24.jpg",
                "blogUrl": "http://blog.csdn.net/cyh_24",
                "blogType": "计算机视觉"
            },
            {
                "enName": "developer_jiangqq",
                "cnName": "江清清",
                "motto":  "江清清的专栏.",
                "avatarUrl": "http://avatar.csdn.net/1/C/5/1_jiangqq781931404.jpg",
                "blogUrl": "http://blog.csdn.net/developer_jiangqq",
                "blogType": "React Native"
            },
            {
                "enName": "hejjunlin",
                "cnName": "何俊霖",
                "motto":  "小积成海",
                "avatarUrl": "http://avatar.csdn.net/9/5/0/1_hejjunlin.jpg",
                "blogUrl": "http://blog.csdn.net/hejjunlin",
                "blogType": "android FFmpeg"
            },
            {
                "enName": "yayun0516",
                "cnName": "张亚运",
                "motto":  "Technology changes life，Code writes everything.",
                "avatarUrl": "http://avatar.csdn.net/D/6/D/1_yayun0516.jpg",
                "blogUrl": "http://blog.csdn.net/yayun0516",
                "blogType": "android"
            },
            {
                "enName": "wwj_748",
                "cnName": "巫文杰",
                "motto":  "一个人走到任何境地全都是因为自己.",
                "avatarUrl": "http://avatar.csdn.net/C/C/8/1_wwj_748.jpg",
                "blogUrl": "http://avatar.csdn.net/C/C/8/1_wwj_748.jpg",
                "blogType": "android"
            },
            {
                "enName": "coder_pig",
                "cnName": "庄培杰",
                "motto":  "时间一天天过去，我们终会因我们的努力或堕落变得丰富或苍白",
                "avatarUrl": "http://avatar.csdn.net/C/2/C/1_zpj779878443.jpg",
                "blogUrl": "http://blog.csdn.net/coder_pig",
                "blogType": "android"
            },
            {
                "enName": "guolin_blog",
                "cnName": "郭霖",
                "motto":  "每当你在感叹，如果有这样一个东西就好了的时候，请注意，其实这是你的机会",
                "avatarUrl": "http://avatar.csdn.net/8/B/B/1_sinyu890807.jpg",
                "blogUrl": "http://blog.csdn.net/guolin_blog",
                "blogType": "android"
            },
            {
                "enName": "singwhatiwanna",
                "cnName": "任玉刚",
                "motto":  "有创新精神的Android技术分享者",
                "avatarUrl": "http://avatar.csdn.net/0/2/C/1_singwhatiwanna.jpg",
                "blogUrl": "http://blog.csdn.net/singwhatiwanna",
                "blogType": "android"
            },
            {
                "enName": "cym492224103",
                "cnName": "陈宇明",
                "motto":  "分享既是快乐！更多源码请查看javaapk.com.",
                "avatarUrl": "http://avatar.csdn.net/F/A/3/1_cym492224103.jpg",
                "blogUrl": "http://blog.csdn.net/cym492224103",
                "blogType": "android"
            },
            {
                "enName": "eclipsexys",
                "cnName": "徐宜生",
                "motto":  "路漫漫其修远兮 吾将上下而求索",
                "avatarUrl": "http://avatar.csdn.net/A/6/8/1_x359981514.jpg",
                "blogUrl": "http://blog.csdn.net/eclipsexys",
                "blogType": "android"
            },
            {
                "enName": "zhaokaiqiang1992",
                "cnName": "赵凯强",
                "motto":  "专注Android移动开发，热爱分享，支持开源",
                "avatarUrl": "http://avatar.csdn.net/C/6/8/1_bz419927089.jpg",
                "blogUrl": "http://blog.csdn.net/zhaokaiqiang1992",
                "blogType": "android"
            },
            {
                "enName": "harvic880925",
                "cnName": "张恩伟",
                "motto":  "当乌龟有了梦想……",
                "avatarUrl": "http://avatar.csdn.net/0/D/3/1_harvic880925.jpg",
                "blogUrl": "http://blog.csdn.net/harvic880925",
                "blogType": "android"
            },
            {
                "enName": "xlgen157387",
                "cnName": "徐刘根",
                "motto":  "xlgen157387的专栏",
                "avatarUrl": "http://avatar.csdn.net/D/7/D/1_u010870518.jpg",
                "blogUrl": "http://blog.csdn.net/xlgen157387",
                "blogType": "android"
            },
            {
                "enName": "yanbober",
                "cnName": "晏博",
                "motto":  "知道+做到=得到",
                "avatarUrl": "http://avatar.csdn.net/7/3/D/1_yanbober.jpg",
                "blogUrl": "http://blog.csdn.net/yanbober",
                "blogType": "android"
            },
            {
                "enName": "bboyfeiyu",
                "cnName": "何红辉",
                "motto":  "LIFE IS LIKE A BATTLE.",
                "avatarUrl": "http://avatar.csdn.net/3/5/2/1_bboyfeiyu.jpg",
                "blogUrl": "http://blog.csdn.net/bboyfeiyu",
                "blogType": "android"
            },
            {
                "enName": "Luoshengyang",
                "cnName": "老罗的Android之旅",
                "motto":  "爱生活，爱Android",
                "avatarUrl": "http://avatar.csdn.net/5/6/E/1_luoshengyang.jpg",
                "blogUrl": "http://blog.csdn.net/Luoshengyang",
                "blogType": "android"
            },
            {
                "enName": "xyz_lmn",
                "cnName": "张兴业",
                "motto":  "会设计的程序员和会编程的设计师,专注移动互联网。",
                "avatarUrl": "http://avatar.csdn.net/E/D/5/1_xyz_lmn.jpg",
                "blogUrl": "http://blog.csdn.net/xyz_lmn",
                "blogType": "android"
            }
        ];
        var resJson = {
            "data": infos,
            "msg": "获取数据成功",
            "status": 200
        };
        res.end(jsonUtil.josnObj2JsonString(resJson));
    })

};