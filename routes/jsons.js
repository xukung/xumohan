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

        let sqlStr = `SELECT * FROM sort ORDER BY orderid ASC`;

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

router.get('/sort/detail', function (req, res, next) {
    let id = req.query.id || 1;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        let sqlStr = `SELECT * FROM sort WHERE id="${id}"`;

        // console.log('sqlStr:', sqlStr);

        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            if (rows.length > 0) {
                //success
                // console.log(rows);

                let obj = {
                    status: 'success',
                    data: rows[0],
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

router.post('/sort/add', function (req, res, next) {
    let cname = req.body.cname;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let sqlObj = {
            cname: cname,
            orderid: 100,
        };

        connection.query(`INSERT INTO sort SET ?`, sqlObj, function (err, results, fields) {
            if (err) throw err;
            let obj = {
                status: 'success',
                data: {}
            };

            res.json(obj);
            connection.release();
        });

    });
});

router.post('/sort/edit', function (req, res, next) {
    let id = req.body.id;
    let orderid = parseInt(req.body.orderid, 10);
    let cname = req.body.cname;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let sqlObj = {
            orderid: orderid,
            cname: cname,
        };
        connection.query(`UPDATE sort SET ? WHERE id="${id}"`, sqlObj, function (err, rows) {
            if (err) throw err;
            let obj = {
                status: 'success',
                data: '保存成功!',
            };
            res.json(obj);
            connection.release();
        });
    });
});

router.get('/sort/del', function (req, res, next) {
    let id = req.query.id;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let sqlStr = `DELETE FROM sort WHERE id="${id}"`;

        connection.query(sqlStr, function (err, results) {
            if (err) throw err;

            let obj = {};
            if (results.affectedRows > 0) {
                obj = {
                    status: 'success',
                    data: '删除成功'
                };
            } else {
                obj = {
                    status: 'error',
                    data: '删除失败'
                };
            }

            res.json(obj);
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
                    data: rows[0],
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

//添加
router.post('/article/add', function (req, res, next) {
    let title = req.body.title;
    let note = req.body.note;
    let sort = req.body.sort;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let sqlObj = {
            title: title,
            note: note,
            sort: sort,
        };

        connection.query(`INSERT INTO article SET ?`, sqlObj, function (err, results, fields) {
            if (err) throw err;
            let obj = {
                status: 'success',
                data: {}
            };

            res.json(obj);
            connection.release();
        });

    });
});

//修改
router.post('/article/edit', function (req, res, next) {
    let id = req.body.id;
    let sort = req.body.sort;
    let title = req.body.title;
    let note = req.body.note;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let sqlObj = {
            sort: sort,
            title: title,
            note: note,
        };
        connection.query(`UPDATE article SET ? WHERE id="${id}"`, sqlObj, function (err, rows) {
            if (err) throw err;
            let obj = {
                status: 'success',
                data: '保存成功!',
            };
            res.json(obj);
            connection.release();
        });
    });
});

//删除
router.get('/article/del', function (req, res, next) {
    let id = req.query.id;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        let sqlStr = `DELETE FROM article WHERE id="${id}"`;

        connection.query(sqlStr, function (err, results) {
            if (err) throw err;

            let obj = {};
            if (results.affectedRows > 0) {
                obj = {
                    status: 'success',
                    data: '删除成功'
                };
            } else {
                obj = {
                    status: 'error',
                    data: '删除失败'
                };
            }

            res.json(obj);
            connection.release();
        });
    });
});


module.exports = router;
