var express = require('express');
var router = express.Router();
var requestBackend = require('../server/requestBackend');

/**
 * 所有请求前缀  /json
 * */

router.get('/project/list', function (req, res, next) {
    let keywords = encodeURIComponent(req.query.keywords) || '';

    // console.info('keywords:', keywords);

    requestBackend.oaGet(`/ReadOperation/showProList`, function (body) {
        res.send(body);
    });
});

router.post('/project/add', function (req, res, next) {
    let data = {
        type: 'add',
        proName: req.body.proName,
    };

    requestBackend.oaPost('/EditOperation/addNewPro', data, function (body) {
        res.send(body);
    });
});


module.exports = router;
