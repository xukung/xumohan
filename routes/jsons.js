var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var pool = require('../lib/pool_mysql');
var moment = require('moment');

/**
 * 所有请求前缀  /json
 * */

router.get('/article/list', function (req, res, next) {
    let offset = req.query.offset || 0;
    let size = req.query.size || 10;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        let sqlStr = `SELECT * FROM article ORDER BY datetime DESC LIMIT ${size} OFFSET ${offset} `;

        // console.log('sqlStr:', sqlStr);

        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                //success
                // console.log(rows);
                function formatDate(cur) {
                    cur.date_create_short = moment(cur.datetime).format('YYYY-MM-DD');
                    cur.date_create = moment(cur.datetime).format('YYYY-MM-DD HH:mm:ss');
                    cur.note=null;
                }

                rows.map(function (item, index) {
                    return formatDate(item)
                });

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
