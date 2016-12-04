var express = require('express');
var path = require('path');
var mkdirs = require('./mkdirs');
var getNavObj = require('./getNavObj');
var moment = require('moment');
moment.locale('zh-cn');
var fs = require('fs');

var generatePage=function (rows, res, connection) {
    for (var i = 0; i < rows.length; i++) {
        var dirPath = path.join(__dirname, '../public/html', moment(rows[i].datetime).format('YYYY/MM/DD'));
        //闭包
        (function (_row, _dirPath) {
            mkdirs(_dirPath, 0777, function () {
                var createTime = moment(_row.datetime).format('YYYY-MM-DD');
                //console.log('目录创建成功');

                getNavObj({"sort": _row.sort}, function (navObj) {
                    res.render('detail', {
                        title: _row.title,
                        keywords: _row.keywords,
                        description: _row.description,
                        navObj: navObj,
                        result: _row,
                        createTime: createTime
                    }, function (err, html) {
                        if (err) throw err;
                        fs.writeFile(path.join(_dirPath, _row.id + '.html'), html, function () {
                            console.log(_row.id + '保存成功！');
                            //更新数据库的path字段，保存路径
                            connection.query("UPDATE article SET ? WHERE id=" + _row.id, {
                                    path: '/html/' + moment(_row.datetime).format('YYYY/MM/DD/')
                                },
                                function (err, result) {
                                    if (err) throw err;
                                }
                            );
                        });
                    });
                });
            });
        })(rows[i], dirPath);
    }
};

module.exports = generatePage;
