var express = require('express');
var router = express.Router();

router.get('/*', function (req, res, next) {
    res.render('blog', {title: 'blog', file: "app.js"});
});

module.exports = router;