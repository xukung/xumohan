var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

const { series, watch, src, dest } = require('gulp');


watch(['./public/src/scss/*.scss'], { ignoreInitial: false }, function scssToCss(cb) {
    var processors = [
        autoprefixer,
        cssnano,
    ];
    return src('./public/src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compact',  //[compressed,compact,nested,expanded]
        }).on('error', sass.logError))
        // .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./public/dist/css'));

    cb();
});

function defaultTask(cb) {
    cb();
}

exports.default = series(defaultTask);