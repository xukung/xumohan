var express = require('express');
var path = require('path');
var mkdirs = require('./mkdirs');
var getNavObj = require('./getNavObj');
var moment = require('moment');
moment.locale('zh-cn');
var fs = require('fs');

var generateList = function (sortArr, res, connection) {
    for (var i = 0; i < sortArr.length; i++) {
        var sort = sortArr[i].id,
            sortName = sortArr[i].cname,
            offset = 0,
            pageSize = 20,  //首次加载展示条数
            dirPath = path.join(__dirname, '../public/html', 'list_' + sort + '.html'),
            sqlStr = "SELECT id,top,sort,source,title,file,datetime FROM article WHERE sort=" + sort
                + " AND path IS NOT NULL ORDER BY top DESC,id DESC LIMIT " + offset + "," + pageSize;
        //闭包
        (function (_sort, _sortName, _dirPath, _sqlStr) {
            connection.query(_sqlStr, function (err, rows) {
                if (err) throw err;
                for (var i = 0; i < rows.length; i++) {
                    rows[i].datetimeFromNow = moment(rows[i].datetime).fromNow();
                    rows[i].newsPath = '/html/' + moment(rows[i].datetime).format('YYYY/MM/DD') + '/' + rows[i].id + '.html';
                    if (rows[i].file) {
                        rows[i].hasPic = true;
                    }
                }

                getNavObj({"sort": _sort}, function (navObj) {
                    res.render('index', {
                        title: _sortName,
                        keywords: "万函网,物联网,新闻,财经,科技,历史,商道,人物",
                        description: "万函网是中国领先的资讯网站，为用户提供专业的新闻类、财经类和科技类资讯",
                        navObj: navObj,
                        results: rows
                    }, function (err, html) {
                        if (err) throw err;
                        fs.writeFile(_dirPath, html, function () {
                            console.log(_dirPath + '保存成功！');
                        });
                    });
                });

            });
        })(sort, sortName, dirPath, sqlStr);
    }
};

module.exports = generateList;
