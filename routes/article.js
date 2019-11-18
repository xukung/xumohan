var express = require('express');
var router = express.Router();

/**
 * 路由前缀 /article
 */


router.get('/list', function (req, res, next) {
    res.render('blog', {title: 'blog'});
});

router.get('/detail', function (req, res, next) {
    res.render('blog', {title: 'blog'});
});

router.get('/add', function (req, res, next) {
    res.render('blog', {title: 'blog'});
});

router.get('/edit', function (req, res, next) {
    res.render('blog', {title: 'blog'});
});


module.exports = router;