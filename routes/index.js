var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {title: 'tech', file: "app.js"});
});

router.get('/project', function (req, res, next) {
    res.render('index', {title: 'tech', file: "app.js"});
});

router.get('/resource', function (req, res, next) {
    res.render('index', {title: 'tech', file: "app.js"});
});



module.exports = router;