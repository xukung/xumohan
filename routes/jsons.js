var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var pool = require('../lib/pool_mysql');
var moment = require('moment');

/**
 * 所有请求前缀  /json
 * */


//分类列表
router.get('/sort/list', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        let sqlStr = `SELECT * FROM sort ORDER BY id ASC`;

        // console.log('sqlStr:', sqlStr);

        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                //success
                // console.log(rows);

                let obj = {
                    status: 'success',
                    data: rows
                };

                res.json(obj);
            } else {
                let obj = {
                    status: 'success',
                    data: []
                };
                res.json(obj);
            }
            connection.release();
        });
    });
});

//article总条数
router.get('/article/total', function (req, res, next) {
    let sort = req.query.sort;
    let keywords = req.query.keywords;

    let sortStr = sort === '0' ? `WHERE sort!="0" ` : `WHERE sort="${sort}" `;
    let keyStr = keywords === '' ? `` : ` AND title like "%${keywords}%" `;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        // let sqlStr = sort === '0' ? `SELECT * FROM article` : `SELECT * FROM article WHERE sort="${sort}"`;
        let sqlStr = `SELECT * FROM article ${sortStr} ${keyStr}`;
        // console.log('sqlStr:', sqlStr);

        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                //success
                // console.log(rows);

                let obj = {
                    status: 'success',
                    data: rows.length,
                };

                res.json(obj);
            } else {
                let obj = {
                    status: 'success',
                    data: 0,
                };
                res.json(obj);
            }
            connection.release();
        });
    });
});

//article 列表
router.get('/article/list', function (req, res, next) {
    let page = parseInt(req.query.page, 10) || 1;
    let size = parseInt(req.query.size, 10) || 10;
    let offset = (page - 1) * size;
    let sort = req.query.sort;
    let keywords = req.query.keywords;
    let sortStr = sort === '0' ? `` : `WHERE sort="${sort}" `;
    let keyStr = keywords === '' ? `` : ` AND title like "%${keywords}%" `;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        let sqlStr = `SELECT article.*,sort.id AS sort_id,sort.cname AS sort_name 
        FROM article INNER JOIN sort 
        ON article.sort=sort.id 
        ${sortStr}
        ${keyStr}
        ORDER BY datetime DESC 
        LIMIT ${size} OFFSET ${offset} `;

        // console.log('sqlStr:', sqlStr);

        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                //success
                // console.log(rows);
                function formatDate(cur) {
                    cur.datetime = moment(cur.datetime).format('YYYY-MM-DD');
                    // cur.datetime = moment(cur.datetime).format('YYYY-MM-DD HH:mm:ss');
                    cur.note = null;
                }

                rows.map(function (item, index) {
                    return formatDate(item)
                });

                let obj = {
                    status: 'success',
                    data: rows,
                    total: rows.length,
                };

                res.json(obj);
            } else {
                let obj = {
                    status: 'success',
                    data: [],
                    total: 0,
                };
                res.json(obj);
            }
            connection.release();
        });
    });
});

//article详情
router.get('/article/detail', function (req, res, next) {
    let id = req.query.id || 1;
    let offset = req.query.offset || 0;
    let size = req.query.size || 10;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        let sqlStr = `SELECT * FROM article WHERE id="${id}"`;

        // console.log('sqlStr:', sqlStr);

        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                //success
                // console.log(rows);

                let obj = {
                    status: 'success',
                    data: rows
                };

                res.json(obj);
            } else {
                let obj = {
                    status: 'success',
                    data: []
                };
                res.json(obj);
            }
            connection.release();
        });
    });
});


module.exports = router;
