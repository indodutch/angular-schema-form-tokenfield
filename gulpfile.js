//two main tasks are 'gulp watch' and 'gulp build'

//dependencies:
var gulp = require('gulp');
    //to use in conjunction with chrome plugin:
var livereload = require('gulp-livereload');
    //for css:
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
    //for javascript:
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
    //for cleaning out dist/ directory before build:
var del = require('del');
    //angular-specific:
var ngAnnotate = require('gulp-ng-annotate');
var htmlify = require('gulp-angular-htmlify');
    //for bundling up js bower dependencies into one vendor file on build:
// var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var useref = require('gulp-useref');

var htmlmin = require('gulp-htmlmin');
var templateCache = require('gulp-angular-templatecache');

//paths object to save file paths for ease as gulpfile gets larger
var paths = {
  dev: {
    css: 'src/css',
    html: 'src/**/*.html',
    sass: 'src/scss/*.scss',
    js: 'src/**/*.js',
    bower: 'bower_components/**'
  },
  build: {
    main: 'dist/',
    css: 'dist/css',
    js: 'dist/'
  }
};

//for now, only used in bower-files task
var jsFilter = gulpFilter('**/*.js');

gulp.task('default', ['build'])

//watch for changes and compile css and run jshint on those changes
//also use livereload to automatically reload page
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.dev.html).on('change', livereload.changed);
  gulp.watch(paths.dev.sass, ['styles']).on('change', livereload.changed);
  gulp.watch(paths.dev.js, ['lint']).on('change', livereload.changed);
});

//watch scss for changes and render into minified css with nice auto-prefixing
gulp.task('styles', function() {
  return gulp.src(paths.dev.sass)
    .pipe(sass({ style: 'expanded', errLogToConsole: true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('main.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('app/public/css'));
});

//stylish output for errors
gulp.task('lint', function(cb) {
  gulp.src(paths.dev.js)
  .pipe(jshint()).on('error', errorHandler)
  .pipe(jshint.reporter(stylish))
  .pipe(jshint.reporter('fail'));
  cb(null);
});

//build task, with other tasks as dependencies and then javascript handling in anonymous function
gulp.task('build', ['empty-dist', 'lint', 'templates', 'copy-css'], function() {
    gulp.src(['./templates.js', paths.dev.js])
    .pipe(concat('angular-schema-form-tokenfield.js'))
    .pipe(gulp.dest(paths.build.js));

gulp.src(['./templates.js', paths.dev.js])
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('angular-schema-form-tokenfield.min.js'))
    .pipe(gulp.dest(paths.build.js))
});

//task to clear out dist/ folder befor building out deployment version of app - runs before every other task in 'gulp build'
gulp.task('empty-dist', function(cb) {
  del([paths.build.main+'/**/*']);
  cb(null);
});

//copy minified CSS over to /dist
gulp.task('copy-css', function (cb) {
  gulp.src(paths.dev.css)
    .pipe(gulp.dest(paths.build.css));
  cb(null);
});

gulp.task('templates', function(cb) {
  gulp.src(paths.dev.html)
      .pipe(htmlify())
      .pipe(htmlmin({
        'collapseWhitespace': false
      }))
      .pipe(templateCache({
        module: 'schemaForm',
        root: 'directives/decorators/bootstrap/tokenfield/'
      }))
      .pipe(gulp.dest("."))
    cb(null);
});

//error handler helper for jshint
function errorHandler (error) {
  this.emit('end');
}