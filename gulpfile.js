var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');

var destPath = './docs';

gulp.task('sass', function () {
  return gulp
    .src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['Android >= 4.4', 'Chrome >= 20', 'Firefox >= 15', 'Explorer >= 10', 'iOS >= 6', 'Safari >= 6', 'Opera >= 15'],
      cascade: false
    }))
    .pipe(csso())
    .pipe(gulp.dest(destPath + '/css'))
});

gulp.task('js', function () {
  return gulp
    .src('./js/**/*.js')
    //.pipe(uglify())
    .pipe(gulp.dest(destPath + '/js'))
});

gulp.task('deps', function () {
  return gulp
    .src([
      './js/jquery-throttle-debounce.min.js',
      './js/isMobile.min.js',
      './js/swiper.js',
      './js/tether.js',
      './js/util.js',
      './js/tooltip.js',
      './js/popover.js'
    ])
    .pipe(concat('deps.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(destPath + '/js'))
});

gulp.task('jsxc', function () {
  return gulp
    .src([
      './jsxc/build/lib/jquery.ui.min.js',
      './jsxc/build/lib/jquery.slimscroll.js',
      './jsxc/build/lib/jquery.fullscreen.js',
      './jsxc/build/lib/jsxc.dep.js',
      './jsxc/build/jsxc.js'
    ])
    .pipe(concat('jsxc.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(destPath + '/js'))
});

gulp.task('watch', ['sass', 'js'], function () {
  gulp.watch(['./sass/**/*.scss'], ['sass']);
  gulp.watch(['./js/**/*.js'], ['js']);
});

gulp.task('default', ['sass', 'js']);