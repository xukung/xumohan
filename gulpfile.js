var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');

var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

const { series } = require('gulp');

// gulp.task('watch', function () {
//     gulp.watch('./public/src/scss/*.scss', ['sass']);
// });


// gulp.task('sass', function () {
//     var processors = [
//         autoprefixer,
//         cssnano,
//     ];
//     return gulp.src('./public/src/scss/*.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(postcss(processors))
//         .pipe(gulp.dest('./public/dist/css'));
// });

gulp.task('watch', function () {
    gulp.watch('./public/src/scss/*.scss', ['sass']);
});

gulp.task('sass', function () {
    var processors = [
        autoprefixer,
        cssnano,
    ];
    return gulp.src('./public/src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./public/dist/css'));
});

function defaultTask(cb) {
    // place code for your default task here

    console.log('abc');
    

    cb();
  }

exports.default = defaultTask;