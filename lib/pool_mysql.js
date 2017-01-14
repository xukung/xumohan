var express = require('express');
var mysql = require('mysql');

var pool = mysql.createPool({

    // host: 'localhost',
    // user: 'root',
    // password: '123456',
    // database: 'mohan',

    host: '103.24.228.145',
    user: 'root',
    password: 'tjkw',
    database: 'mohan',


    connectionLimit: 10
});

module.exports = pool;