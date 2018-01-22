var express = require('express');
var router = express.Router();

router.get('/*', function (req, res, next) {
    res.render('index', {title: 'ObjectArk', file: "app.js"});
});

module.exports = router;