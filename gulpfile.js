var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');

var destPath = './public_html';

gulp.task('sass', function () {
  return gulp
    .src('./sass/**/*')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['Android >= 4.4', 'Chrome >= 20', 'Firefox >= 15', 'Explorer >= 10', 'iOS >= 6', 'Safari >= 6', 'Opera >= 15'],
      cascade: false
    }))
    .pipe(csso())
    .pipe(gulp.dest(destPath + '/css'))
});

gulp.task('uglify', function () {
  return gulp
    .src('./js/**/*')
    .pipe(uglify())
    .pipe(gulp.dest(destPath + '/js'))
});

gulp.task('watch', function () {
  gulp.watch(['./sass/**/*'], ['sass']);
  gulp.watch(['./js/**/*'], ['js']);
});

gulp.task('default', ['sass', 'uglify']);