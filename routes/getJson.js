var express = require('express');
var router = express.Router();
var pool = require('../lib/pool_mysql');
var moment = require('moment');
moment.locale('zh-cn');


//导航菜单的json
router.get('/navItems', function (req, res, next) {
    var sort = parseInt(req.query.sort ? req.query.sort : 1);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = 'SELECT * FROM category ORDER BY orderid';
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].id === sort) {
                    rows[i].cur = true;
                } else {
                    rows[i].cur = false;
                }
            }
            res.render('json', {layout: null, results: JSON.stringify(rows)});
            connection.release();
        });
    });
});

//新闻列表的json
router.get('/newsItems', function (req, res, next) {
    var sort = parseInt(req.query.sort ? req.query.sort : 1);
    var offset = parseInt(req.query.offset ? req.query.offset : 0);
    var pageSize = 20;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT id,top,sort,source,title,file,datetime FROM article WHERE sort=" + sort + " AND path IS NOT NULL ORDER BY top DESC,id DESC LIMIT " + offset + "," + pageSize;
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                rows[i].datetimeFromNow = moment(rows[i].datetime).fromNow();
                // rows[i].newsPath = '/html/' + moment(rows[i].datetime).format('YYYY/MM/DD') + '/' + rows[i].id + '.html';
            }
            res.render('json', {layout: null, results: JSON.stringify(rows)});
            connection.release();
        });
    });
});

//获取删除旧文章的id的 json
router.get('/delChunkIds', function (req, res, next) {
    var sort = parseInt(req.query.sort ? req.query.sort : 0);
    var offset = parseInt(req.query.offset ? req.query.offset : 0);
    var pageSize = 100;  //每次删除的文章条数

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT id FROM article WHERE sort=" + sort + " ORDER BY id ASC LIMIT " + offset + "," + pageSize;
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            res.send(JSON.stringify(rows));
            connection.release();
        });
    });
});


module.exports = router;
