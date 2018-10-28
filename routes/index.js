var express = require('express');
var router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Work harder,will luckier!'});
});

router.post('/verify', function (req, res, next) {
    let name = req.body.name;
    let pw = req.body.pw;
    if (name === 'xukung' && pw === '000000') {
        req.session.user = 'xukung';
        res.redirect('/article/list');
    } else {
        res.send('You are denied!');
    }

});

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