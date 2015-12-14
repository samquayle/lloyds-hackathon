/*
  Gulpfile
  ========
*/

'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var browserSync  = require('browser-sync').create();
var reload       = browserSync.reload;

gulp.task('scss', function() {
  gulp.src('public/scss/main.scss')
  .pipe(sass({
    outputStyle: 'expanded',
    errLogToConsole: false
  }))
  .pipe(gulp.dest('public/css'))
  .pipe(reload({stream: true}));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    proxy: 'localhost:3000',
    notify: false
  });
});

gulp.task('watch', function() {
  gulp.watch('public/scss/**/*.scss', ['scss']);
  gulp.watch('public/js/**/*.js').on('change', browserSync.reload);
});

gulp.task('serve', ['scss','browser-sync','watch']);
