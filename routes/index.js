var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.redirect('/article/list');
});

router.get('/it', function (req, res, next) {
    res.render('it', {title: 'tech'});
});

router.get('/code', function (req, res, next) {
    res.render('code', {title: 'tech'});
});

router.get('/regexp', function (req, res, next) {
    res.render('regexp', {title: 'tech'});
});



module.exports = router;