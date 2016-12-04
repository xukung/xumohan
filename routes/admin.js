var express = require('express');
var path = require('path');
var router = express.Router();
var pool = require('../lib/pool_mysql');
var moment = require('moment');  //处理日期和时间
moment.locale('zh-cn');
var crypto = require('crypto');  //生成md5码
var EventProxy = require('eventproxy');  //对查询数据库的多个事件进行监控处理
var ep = new EventProxy();
var formidable = require('formidable');  //表单含有文件上传
var fs = require('fs');
var gm = require('gm');  //图片压缩

router.get('/login', function (req, res, next) {
    if (req.session.loginName === 'xukung') {
        //已经成功登录
        res.redirect('/admin/');
    } else {
        //尚未登录
        res.render('admin_login', {
            layout: null,
            title: "登录后台"
        });
    }
});

router.post('/login-validate', function (req, res, next) {
    var name = req.body.name,
        pwd = req.body.pwd,
        pwd_md5 = crypto.createHash('md5').update(pwd).digest('hex');

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM admin WHERE nm='" + name + "' AND pw='" + pwd_md5 + "'";
        connection.query(sqlStr, function (err, rows) {
            //console.log(rows.length);
            if (err) throw err;
            if (rows.length > 0) {
                //成功登录
                req.session.loginName = 'xukung';
                res.redirect('/admin/');
            } else {
                //登录失败
                res.send('登录失败' + pwd_md5);
            }
            connection.release();
        });
    });
});

router.get('/*', function (req, res, next) {
    //next();
    //return;

    if (req.session.loginName === 'xukung') {
        //已经成功登录
        next();
    } else {
        //尚未登录
        res.redirect('/admin/login');
    }
});

router.get('/', function (req, res, next) {
    var sort = parseInt(req.query.sort ? req.query.sort : 1),
        page = parseInt(req.query.page ? req.query.page : 1),
        pageSize = 20,
        delChunkStatus,  //控制是否显示100条旧新闻
        offset = (page - 1) * pageSize;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM article WHERE sort=" + sort + " ORDER BY top DESC,id DESC LIMIT " + offset + "," + pageSize,
            sqlStr_all = "SELECT COUNT(*) AS number FROM article WHERE sort=" + sort,
            sqlStr_category = "SELECT * FROM category ORDER BY orderid",
            totalNumber = 0,
            totalPage = 0,
            sorts,
            datas;

        //计算总数
        connection.query(sqlStr_all, function (err, rows) {
            if (err) throw err;
            totalNumber = rows[0].number;
            totalPage = Math.ceil(rows[0].number / pageSize);
            ep.emit('event1');
        });

        //当前页数据
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                rows[i].datetime = moment(rows[i].datetime).fromNow();
                //如果没有缩略图
                if (!rows[i].file) {
                    rows[i].noImg = true;
                }
            }
            datas = rows;
            ep.emit('event2');
        });

        //获得所有类目
        connection.query(sqlStr_category, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                if (sort == rows[i].id) {
                    rows[i].status = 'cur';
                }
            }
            sorts = rows;
            ep.emit('event3');
        });

        if (sort !== 2 && sort !== 5) {
            //如果不是商道2和人物5
            delChunkStatus = true;
        }

        ep.all('event1', 'event2', 'event3', function () {
            res.render('admin_index', {
                layout: 'admin',
                title: '文章管理',
                results: datas,
                delChunkStatus: delChunkStatus,
                sort: sort,
                sorts: sorts,
                page: page,
                pagePrev: (page - 1) > 0 ? (page - 1) : 1,
                pageNext: (page + 1) > totalPage ? totalPage : (page + 1),
                totalPage: totalPage,
                totalNumber: totalNumber
            });
        });

        connection.release();
    });
});

router.get('/add', function (req, res, next) {
    var sort = parseInt(req.query.sort ? req.query.sort : 1);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM category";
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                if (sort == rows[i].id) {
                    rows[i].status = 'cur';
                }
            }
            res.render('admin_add', {
                layout: 'admin',
                title: "添加文章",
                sorts: rows
            });
        });

        connection.release();
    });
});

router.post('/addDB', function (req, res, next) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) throw err;

        var sort = fields.sort,
            title = fields.title,
            keywords = fields.keywords,
            description = fields.description,
            top = fields.top,
            note = fields.note,
            fileNameNew;

        //如果含有上传文件
        if (files.file.size > 0) {
            var filePath = files.file.path,
                fileType = files.file.type,
                fileName = files.file.name,
                fileSize = files.file.size,
                file_md5 = crypto.createHash('md5').update((new Date().getTime()) + ' ').digest('hex'),

                fileExtensionName,
                filePathNew;

            var arr = fileName.split('.');
            fileExtensionName = arr[arr.length - 1];

            //filePathNew = '../../grab/webroot/' + 'public/images/upload/smallPhoto/' + file_md5 + '.' + fileExtensionName;
            //fileNameNew = file_md5 + '.' + fileExtensionName;

            filePathNew = '../../grab/webroot/' + 'public/images/upload/smallPhoto/' + file_md5 + '.jpg';
            fileNameNew = file_md5 + '.jpg';


            if (fileSize > 2 * 1024 * 1024) {
                fs.unlink(filePath, function () {	//fs.unlink 删除用户上传的文件
                    res.send('上传文件过大>2M');
                });
            } else if (fileType.split('/')[0] != 'image') {
                fs.unlink(filePath, function () {
                    res.send('上传的不是图片');
                });
            } else {
                gm(filePath)
                    .resize(300, 300, '>')
                    /*-resize
                     100x100      高度和宽度比例保留最高值，高比不变
                     100x100^     高度和宽度比例保留最低值，宽高比不变
                     100x100!      宽度和高度强制转换，忽视宽高比
                     100x100>     更改长宽，当图片长或宽超过规定的尺寸
                     100x100<     更改长宽 只有当图片长宽都超过规定的尺寸
                     100x100^>   更改长宽，当图片长或宽超过规定的尺寸。高度和宽度比例保留最低值
                     100x100^<   更改长宽，只有当图片长宽都超过规定的尺寸。高度和宽度比例保留最低值
                     100             按指定的宽度缩放，保持宽高比例
                     x100          按指定高度缩放，保持宽高比*/
                    .autoOrient()
                    .write(filePathNew, function (err) {
                        if (err) throw err;
                        //删除临时文件
                        fs.unlink(filePath, function () {
                            console.log(filePath + ' 临时文件已删除');
                        });
                    });
            }
        }


        pool.getConnection(function (err, connection) {
            if (err) throw err;
            //console.log('title:' + title);

            connection.query("INSERT INTO article SET ?", {
                sort: sort,
                title: title,
                keywords: keywords,
                description: description,
                top: top,
                note: note,
                //token: token,
                file: fileNameNew
            }, function (err, result) {
                if (err) throw err;
                res.redirect('/admin/?sort=' + sort);
                connection.release();
            });
        });
    });
});

//删除记录和缩略图
router.get('/del', function (req, res, next) {
    var id = parseInt(req.query.id ? req.query.id : 1);

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM article WHERE id=" + id;

        //删除缩略图
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            if (rows[0].file && rows[0].file !== '') {
                var fileSavePath = '../../grab/webroot/' + 'public/images/upload/smallPhoto/' + rows[0].file;
                fs.unlink(fileSavePath, function (err) {
                    //console.log(fileSavePath + ' 缩略图已删除');
                });
            }

            ep.emit('event1');
        });

        //删除html静态文件
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            var htmlPath = './public' + rows[0].path + rows[0].id + '.html';
            fs.unlink(htmlPath, function (err) {
                if (err) throw err;
                console.log(htmlPath + ' 静态页已删除');
            });
            ep.emit('event2');
        });

        //数据库删除记录
        connection.query("DELETE FROM article WHERE id=" + id, function (err, result) {
            if (err) throw err;
            ep.emit('event3');
        });



        ep.all('event1', 'event2', 'event3', function () {
            console.log(id + ' 文章和缩略图已经删除');
            res.send(id + ' 文章和缩略图已经删除');
        });

        connection.release();
    });
});

//仅删除缩略图
router.get('/delImg', function (req, res, next) {
    var id = parseInt(req.query.id ? req.query.id : 1);

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        var sqlStr = "SELECT * FROM article WHERE id=" + id;

        //删除缩略图
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            if (rows[0].file && rows[0].file !== '') {
                var fileSavePath = '../../grab/webroot/' + 'public/images/upload/smallPhoto/' + rows[0].file;
                fs.unlink(fileSavePath, function () {
                    console.log(fileSavePath + ' 缩略图已删除');
                    updateDB();
                });
            }
        });

        //缩略图删除后更新数据库
        function updateDB() {
            connection.query("UPDATE article SET ? WHERE id=" + id, {
                file: ''
            }, function (err, result) {
                res.send('缩略图已删除');
            });
        }

        connection.release();
    });
});

router.get('/modify', function (req, res, next) {
    var sortFrom = parseInt(req.query.sort ? req.query.sort : 1),
        pageFrom = parseInt(req.query.page ? req.query.page : 1),
        id = parseInt(req.query.id ? req.query.id : 1),
        data,
        sorts;

    pool.getConnection(function (err, connection) {
        if (err) throw err;

        var sqlStr = "SELECT * FROM article WHERE id=" + id;
        var sqlStr_sort = "SELECT * FROM category";

        //获取类别信息
        connection.query(sqlStr_sort, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                if (sortFrom == rows[i].id) {
                    rows[i].status = 'cur';
                }
            }
            sorts = rows;
            ep.emit('event1');
        });

        //获取新闻信息
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;

            //如果含有缩略图
            if (rows[0].file) {
                rows[0].hasPic = true;
            }

            //是否置顶
            if (rows[0].top === 1) {
                rows[0].top = true;
            }

            data = rows[0];
            ep.emit('event2');
        });

        ep.all('event1', 'event2', function () {
            res.render('admin_modify', {
                layout: 'admin',
                title: "修改文章",
                sorts: sorts,
                sort: sortFrom,
                page: pageFrom,
                result: data
            });
        });

        connection.release();
    });
});

router.post('/modifyDB', function (req, res, next) {
    var id = req.query.id,
        sortFrom = req.query.sort,
        pageFrom = req.query.page,
        form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) throw err;

        var sort = fields.sort,
        //token = fields.token,
            title = fields.title,
            keywords = fields.keywords,
            description = fields.description,
            top = fields.top,
            note = fields.note,
            fileNameNew;

        if (files.file.size > 0) {
            //如果含有上传文件
            var filePath = files.file.path,
                fileType = files.file.type,
                fileName = files.file.name,
                fileSize = files.file.size,
                file_md5 = crypto.createHash('md5').update((new Date().getTime()) + ' ').digest('hex'),
                arr = fileName.split('.'),
                fileExtensionName,
                filePathNew;

            fileExtensionName = arr[arr.length - 1];
            //filePathNew = '../../grab/webroot/' + 'public/images/upload/smallPhoto/' + file_md5 + '.' + fileExtensionName;
            //fileNameNew = file_md5 + '.' + fileExtensionName;
            filePathNew = '../../grab/webroot/' + 'public/images/upload/smallPhoto/' + file_md5 + '.jpg';
            fileNameNew = file_md5 + '.jpg';

            if (fileSize > 2 * 1024 * 1024) {
                fs.unlink(filePath, function () {	//fs.unlink 删除用户上传的文件
                    res.send('上传文件过大>2M');
                });
            } else if (fileType.split('/')[0] != 'image') {
                fs.unlink(filePath, function () {
                    res.send('上传的不是图片');
                });
            } else {
                gm(filePath)
                    .resize(300, 300, '>')
                    .autoOrient()
                    .write(filePathNew, function (err) {
                        if (err) throw err;
                        //删除临时文件
                        fs.unlink(filePath, function () {
                            console.log(filePath + ' 临时文件已删除');
                        });

                        changeDB_withFile();
                    });
            }
        } else {
            //如果没有上传文件
            changeDB_noFile();
        }

        function changeDB_noFile() {
            pool.getConnection(function (err, connection) {
                if (err) throw err;

                connection.query("UPDATE article SET ? WHERE id=" + id, {
                    sort: sort,
                    title: title,
                    keywords: keywords,
                    description: description,
                    top: top,
                    note: note
                }, function (err, result) {
                    if (err) throw err;
                    res.redirect('/admin/?sort=' + sortFrom + '&page=' + pageFrom);
                    connection.release();
                });
            });
        }

        function changeDB_withFile() {
            pool.getConnection(function (err, connection) {
                if (err) throw err;

                connection.query("UPDATE article SET ? WHERE id=" + id, {
                    sort: sort,
                    title: title,
                    keywords: keywords,
                    description: description,
                    top: top,
                    note: note,
                    file: fileNameNew
                }, function (err, result) {
                    if (err) throw err;
                    res.redirect('/admin/?sort=' + sortFrom + '&page=' + pageFrom);
                    connection.release();
                });
            });
        }


    });


});

router.get('/search', function (req, res, next) {
    var key = req.query.key ? req.query.key : null;
    var page = parseInt(req.query.page ? req.query.page : 1);
    var pageSize = 20;
    var offset = (page - 1) * pageSize;

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        var sqlStr = "SELECT * FROM article WHERE title like '%" + key + "%' ORDER BY id DESC LIMIT " + offset + "," + pageSize,
            sqlStr_all = "SELECT COUNT(*) AS number FROM article WHERE title like '%" + key + "%'",
            totalNumber = 0,
            totalPage = 0,
            datas;

        //计算总数
        connection.query(sqlStr_all, function (err, rows) {
            if (err) throw err;
            totalNumber = rows[0].number;
            totalPage = Math.ceil(rows[0].number / pageSize);
            ep.emit('event1');
        });

        //当前页数据
        connection.query(sqlStr, function (err, rows) {
            if (err) throw err;
            for (var i = 0; i < rows.length; i++) {
                rows[i].datetime = moment(rows[i].datetime).fromNow();
                //如果没有缩略图
                if (!rows[i].file) {
                    rows[i].noImg = true;
                }
            }
            datas = rows;
            ep.emit('event2');
        });


        ep.all('event1', 'event2', function () {
            res.render('admin_search', {
                layout: 'admin',
                title: '搜索',
                results: datas,
                page: page,
                key: key,
                pagePrev: (page - 1) > 0 ? (page - 1) : 1,
                pageNext: (page + 1) > totalPage ? totalPage : (page + 1),
                totalPage: totalPage,
                totalNumber: totalNumber
            });
        });

        connection.release();
    });

});

module.exports = router;