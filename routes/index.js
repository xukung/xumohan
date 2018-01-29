var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.redirect('/article/list');
});

router.get('/it', function (req, res, next) {
    res.render('it', {title: 'tech'});
});



module.exports = router;