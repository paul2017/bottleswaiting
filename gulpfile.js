var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var sh = require('shelljs');
var replace = require('gulp-replace-task');
var fs = require('fs');
var moment = require('./src/bower_components/moment/moment.js');
var bowerJson = require('./bower.json');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
  sass: ['./scss/**/*.scss'],
  css: ['./src/styles/**',
    './src/bower_components/angular-native-picker/build/themes/default*.css'
  ],
  libScripts: ['./src/bower_components/lodash/dist/lodash.js',
    './src/bower_components/moment/moment.js',
    './src/bower_components/jquery/dist/jquery.js',
    './src/bower_components/ionic/js/ionic.bundle.js',
    './src/bower_components/ngCordova/dist/ng-cordova.js',
    './src/scripts/restangular.js',
    // './src/bower_components/restangular/dist/restangular.js',
    './src/bower_components/angular-native-picker/build/angular-datepicker.js',
    './src/bower_components/angular-moment/angular-moment.js',
    './src/bower_components/ui-utils/ui-utils.js',
    './src/bower_components/angular-local-storage/dist/angular-local-storage.js'
  ],
  scripts: ['./src/scripts/app.js',
    './src/scripts/config.js',
    './src/scripts/oauth/*module.js',
    './src/scripts/oauth/*.js',
    './src/scripts/Login/*module.js',
    './src/scripts/Login/*.js',
    './src/scripts/Events/*module.js',
    './src/scripts/Events/*.js',
    './src/scripts/Pass/*module.js',
    './src/scripts/Pass/*.js',
    './src/scripts/Table/*module.js',
    './src/scripts/Table/*.js',
    './src/scripts/Signup/*module.js',
    './src/scripts/Signup/*.js',
    './src/scripts/Payment/*module.js',
    './src/scripts/Payment/*.js',
    './src/scripts/Profile/*module.js',
    './src/scripts/Profile/*.js',
    './src/scripts/Search/*module.js',
    './src/scripts/Search/*.js',
    './src/scripts/Services/*.js',
    './src/scripts/Directives/*.js'
  ],
  module_scr: ['./src/scripts/common/**/*.js',
    './src/scripts/base/**/*.js'
  ],
  staticFiles: ['./src/index.html', './src/views/**/*.html', './src/images/**'],
  fonts: ['./src/bower_components/ionic/fonts/**'],
  dist: './www/'
};
//            './src/scripts/common/**/*.js',
// './src/scripts/base/**/*.js',
// './src/scripts/common/**/*module.js',
//'./src/scripts/base/**/*module.js',

gulp.task('default', ['css', 'scripts-dev', 'libScripts', 'staticFiles', 'fonts']);
gulp.task('prod', ['css', 'scripts', 'libScripts', 'staticFiles', 'fonts']);

gulp.task('buildAndroidDev', ['default'], function() {
  sh.exec('ionic build android');
});
gulp.task('buildAndroidProd', ['prod'], function() {
  sh.exec('ionic build android');
});

gulp.task('replace-dev', function() {
  return gulp.src('src/config.js')
    .pipe(replace({
      patterns: [{
        json: {
          "version": bowerJson.version,
          "timestamp": moment().format(),
          "serviceUrl": "https://beta-api.bottleswaiting.com",
          "serviceAPIPath": "api/1",
          "stripeKey": "pk_test_MyfEr72zRpXGf5JcIadrgugj",
          "fbAppId": "1520852498173223",
          "serviceKey": "",
          "production": false,
          "googleAnalyticsId": ""
        }
      }]
    }))
    .pipe(gulp.dest('src/scripts/'))
});
gulp.task('replace-prod', function() {
  return gulp.src('src/config.js')
    .pipe(replace({
      patterns: [{
        json: {
          "version": bowerJson.version,
          "timestamp": moment().format(),
          "serviceUrl": "https://api.bottleswaiting.com",
          "serviceAPIPath": "api/1",
          "stripeKey": "pk_live_vpAw2lGrJKMp9f39iZ0sdZHP",
          "fbAppId": "1437461449845662",
          "serviceKey": "",
          "production": true,
          "googleAnalyticsId": "UA-55860281-3"
        }
      }]
    }))
    .pipe(gulp.dest('src/scripts/'))
});

gulp.task('sass', function() {
  return gulp.src('./scss/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/styles/'));
});

gulp.task('css', ['sass'], function() {
  return gulp.src(paths.css)
    /*.pipe(minifyCss({keepSpecialComments: 0}))*/
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.dist + 'css/'))
})

gulp.task('libScripts', function() {
  return gulp.src(paths.libScripts)
    .pipe(sourcemaps.init())
    //.pipe(uglify())
    .pipe(concat('lib.js'))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist + 'js/'))
});

gulp.task('scripts', ['replace-prod'], function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist + 'js/'))
});

gulp.task('scripts-dev', ['replace-dev'], function() {
  return gulp.src(paths.scripts)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.dist + 'js/'))
});

gulp.task('staticFiles', function() {
  return gulp.src(paths.staticFiles, {
      base: "./src"
    })
    .pipe(gulp.dest(paths.dist));
});

gulp.task('fonts', function() {

  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist + 'fonts/'));
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.libScripts, ['libScripts']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.staticFiles, ['staticFiles']);
});

gulp.task('watchdev', function() {
  gulp.watch(paths.scripts, ['scripts-dev']);
  gulp.watch(paths.libScripts, ['libScripts']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.staticFiles, ['staticFiles']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});