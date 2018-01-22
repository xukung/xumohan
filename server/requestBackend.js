var request = require('request');

var config = require('../config.json');
var backendHost = config.backend.domain;

exports.oaGet = function (pathName, callback) {
    var options = {
        url: backendHost + pathName,
        method: 'GET',
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            callback('{"status": "err","msg": "服务器请求错误"}');
        } else {
            try {
                if (JSON.parse(body)) {
                    callback(body);
                }
            } catch (err) {
                // console.log("Error name: " + err.name + "");
                // console.log("Error message: " + err.message);
                console.log(err);
                let obj = {
                    status: "error",
                    msg: "服务器返回格式错误",
                    body: body
                };
                callback(JSON.stringify(obj));
            }
        }
    });
};

exports.oaPost = function (pathName, data, callback) {
    // console.log('atiPost header:', header);
    var options = {
        url: backendHost + pathName,
        method: 'POST',
        formData: data
    };

    options.headers = Object.assign({}, {'Content-Type': 'application/x-www-form-urlencoded'});

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            callback('{"status": "err","msg": "服务器请求错误"}');
        } else {
            try {
                if (JSON.parse(body)) {
                    callback(body);
                }
            } catch (err) {
                // console.log("Error name: " + err.name + "");
                // console.log("Error message: " + err.message);
                console.log(err);
                let obj = {
                    status: "error",
                    msg: "服务器返回格式错误",
                    body: body
                };
                callback(JSON.stringify(obj));
            }
        }
    });
};