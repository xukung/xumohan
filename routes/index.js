var express = require('express');
var path = require('path');
var router = express.Router();
var pool = require('../lib/pool_mysql');
var getNavObj = require('../lib/getNavObj');
var generatePage = require('../lib/generatePage');
var generateList = require('../lib/generateList');
var moment = require('moment');
moment.locale('zh-cn');
var fs = require('fs');

router.get('/', function (req, res) {
    //读取静态页面的内容
    var dirPath = path.join(__dirname, '../public/html', 'list_1.html');
    fs.readFile(dirPath, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data.toString());
    });
});


//新闻详情页,动态页面，为了兼容，不要删
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


//不分状态，全部重新生成静态html页面
router.get('/generate/', function (req, res) {
    var begin = parseInt(req.query.begin ? req.query.begin : 1);
    var end = begin + 999;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT article.*,category.cname FROM article INNER JOIN category ON article.sort=category.id WHERE article.id BETWEEN " + begin + " AND " + end;
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            generatePage(rows, res, connection);

            res.send('正在生成页面！');

            connection.release();
        });
    });
});

//把未生成静态页面的文章生成静态html页面
router.get('/generateNew/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT article.*,category.cname FROM article INNER JOIN category ON article.sort=category.id WHERE article.path IS NULL";
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            generatePage(rows, res, connection);

            res.send('正在生成页面！');

            connection.release();
        });
    });
});


//生成分类列表的静态html页
router.get('/generateList/', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM category";
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            var sortArr = [];
            for (var i = 0; i < rows.length; i++) {
                sortArr.push({
                    "id": parseInt(rows[i].id),
                    "cname": rows[i].cname
                });
            }

            generateList(sortArr, res, connection);

            res.send('正在生成列表页！');

            connection.release();
        });
    });
});

router.get('/it', function (req, res) {
    res.render('it', {title: "徐公网经", layout: 'layout_it'});
});

router.get('/code', function (req, res) {
    res.render('code', {title: "常用代码", layout: 'layout_code'});
});

router.get('/regexp', function (req, res) {
    res.render('regexp', {title: "正则表达式速查表", layout: 'plain'});
});



module.exports = router;