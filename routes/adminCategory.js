var express = require('express');
var path = require('path');
var router = express.Router();
var pool = require('../lib/pool_mysql');
var moment = require('moment');  //处理日期和时间
moment.locale('zh-cn');
var EventProxy = require('eventproxy');  //对查询数据库的多个事件进行监控处理
var ep = new EventProxy();


router.get('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM category ORDER BY orderid,id";
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            res.render('admin_category', {
                layout: 'admin',
                title:'栏目管理',
                results: rows
            });
        });
        connection.release();
    });
});

router.get('/add', function (req, res, next) {
    res.render('admin_category_add', {
        layout: 'admin',
        title: '添加栏目'
    });
});

router.post('/addDB', function (req, res, next) {
    var cname = req.body.cname,
        orderid = req.body.orderid;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query("INSERT INTO category SET ?", {
            cname: cname,
            orderid: orderid
        }, function (err, result) {
            if (err) throw err;
            res.redirect('/admin/category');
        });

        connection.release();
    });
});

router.get('/modify', function (req, res, next) {
    var id = parseInt(req.query.id ? req.query.id : 1);

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        var sqlStr = "SELECT * FROM category WHERE id=" + id;

        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            res.render('admin_category_modify', {
                layout: 'admin',
                title: "修改栏目",
                result: rows[0]
            });
        });

        connection.release();
    });
});

router.post('/modifyDB', function (req, res, next) {
    var id = parseInt(req.query.id ? req.query.id : 1),
        cname = req.body.cname,
        orderid = req.body.orderid;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query("UPDATE category SET ? WHERE id=" + id, {
            cname: cname,
            orderid: orderid
        }, function (err, result) {
            if (err) throw err;
            res.redirect('/admin/category');
        });

        connection.release();
    });
});

router.get('/del', function (req, res, next) {
    var id = parseInt(req.query.id ? req.query.id : 1);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM category WHERE id=" + id;

        connection.query("DELETE FROM category WHERE id=" + id, function (err, result) {
            if (err) throw err;
        });

        res.redirect('/admin/category');

        connection.release();
    });


});

module.exports = router;