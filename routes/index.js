var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Work harder,will luckier!'});
});

router.get('/it', function (req, res, next) {
    res.render('it', {title: 'Work harder,will luckier!'});
});

router.get('/code', function (req, res, next) {
    res.render('code', {title: 'Work harder,will luckier!'});
});

router.get('/regexp', function (req, res, next) {
    res.render('regexp', {title: 'Work harder,will luckier!'});
});

router.get('/calc', function (req, res, next) {
    res.render('calc', {title: 'Work harder,will luckier!'});
});


module.exports = router;