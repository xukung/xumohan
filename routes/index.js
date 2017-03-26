var express = require('express');
var path = require('path');
var router = express.Router();
var pool = require('../lib/pool_mysql');
var getNavObj = require('../lib/getNavObj');
var moment = require('moment');
moment.locale('zh-cn');
var fs = require('fs');




/*
router.get('/', function (req, res) {
    var sort = parseInt(req.query.sort ? req.query.sort : 1);
    var offset = parseInt(req.query.offset ? req.query.offset : 0);
    var pageSize = 20;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT id,top,sort,source,title,description,file,datetime FROM article WHERE sort=" + sort + " ORDER BY top DESC,id DESC LIMIT " + offset + "," + pageSize;
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                rows[i].datetimeFromNow = moment(rows[i].datetime).fromNow();
                if (rows[i].file) {
                    rows[i].hasPic = true;
                }
            }

            getNavObj({"sort": sort}, function (navObj) {
                res.render('index', {
                    title: "首页",
                    keywords: "万函网,物联网,新闻,财经,科技,历史,商道,人物",
                    description: "万函网是中国领先的资讯网站，为用户提供专业的新闻类、财经类和科技类资讯",
                    navObj: navObj,
                    results: rows
                });
            });

            connection.release();
        });
    });

});

*/

router.get('/test',function (req, res, next) {
    pool.getConnection(function (err, connection) {
        console.info('try to connect database');
        if (err) throw err;
        var sqlStr = "SELECT * FROM admin";
        connection.query(sqlStr, function (err, rows) {
            console.log('rows.length',rows.length);
            if (err) throw err;
            res.render('index', {title: 'index'});
            connection.release();
        });
    });
});


//新闻详情页,动态页面，为了兼容，不要删
/*
router.get('/news/', function (req, res) {
    var id = parseInt(req.query.id ? req.query.id : 1);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT article.*,category.cname FROM article INNER JOIN category ON article.sort=category.id WHERE article.id=" + id;
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            var createTime = moment(rows[0].datetime).format('YYYY/MM/DD');

            getNavObj({"sort": rows[0].sort}, function (navObj) {
                res.render('detail', {
                    title: rows[0].title,
                    keywords: rows[0].keywords,
                    description: rows[0].description,
                    navObj: navObj,
                    result: rows[0],
                    createTime: createTime
                });
            });

            connection.release();
        });
    });
});
*/



router.get('/', function (req, res) {
    res.render('it', {title: "徐公网经", layout: 'layout_it'});
});

router.get('/code', function (req, res) {
    res.render('code', {title: "常用代码", layout: 'layout_code'});
});

router.get('/regexp', function (req, res) {
    res.render('regexp', {title: "正则表达式速查表", layout: 'plain'});
});



module.exports = router;