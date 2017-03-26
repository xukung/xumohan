var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession= require('express-session');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});

var routes = require('./routes/index');
var routesJson = require('./routes/getJson');
var routesAdmin = require('./routes/admin');
var routesAdminCategory = require('./routes/adminCategory');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('myadmin'));
app.use(expressSession({
    resave: true,   //是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    saveUninitialized: false,   //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    secret: '123456',
    cookie: { maxAge: 60 * 10000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/json', routesJson);
// app.use('/admin', routesAdmin);
// app.use('/admin/category', routesAdminCategory);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('页面不存在');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            layout:'plain',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        layout:'plain',
        message: err.message,
        error: {}
    });
});


module.exports = app;
