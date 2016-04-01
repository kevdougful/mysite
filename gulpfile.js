'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var rename = require('gulp-rename');
var loopbackAngularSdk = require('gulp-loopback-sdk-angular');
var install = require('gulp-install');
var util = require('gulp-util')
var exec = require('child_process').exec;
var Server = require('karma').Server;
var mocha = require('gulp-mocha');
var env = require('gulp-env');

// Set NODE_ENV to 'mock'
gulp.task('mock-env', function() {
    env({ vars: { NODE_ENV: 'mock' } });
});

// Run API tests
gulp.task('test-api', ['mock-env'], function() {
    return gulp.src('test/**/*_test.js')
        .pipe(mocha());
});

// Install Dependencies
gulp.task('install', function() {
    var environment = util.env.NODE_ENV;
    var isProd = environment == 'production';
    return gulp.src(['./package.json', './client/package.json'])
        .pipe(install({production: isProd}));
});

// Generate AngularJS services for loopback API
gulp.task('lb', function() {
    return gulp.src('./server/server.js')
        .pipe(loopbackAngularSdk({
            ngModuleName: 'ApiServices'
        }))
        .pipe(rename('loopback-sdk.js'))
        .pipe(gulp.dest('./client/js'));
});

// Update DB Schema (do not drop tables)
gulp.task('update-db', function(done) {
    exec('node ./server/migrations/update.js', 
    function(err, stdout, stderr) {
        done(err);
    });
});

// Rebuild DB Schema (drop tables, if necessary)
gulp.task('rebuild-db', function(done) {
    exec('node ./server/migrations/rebuild.js', 
    function(err, stdout, stderr) {
        done(err);
    });
});

// Create LoopBack tables in DB (User, Role, etc.)
// Note: This will drop tables if they already exist.
gulp.task('create-lb-tables', function(done) {
    exec('node ./server/migrations/create-lb-tables.js', 
    function(err, stdout, stderr) {
        done(err);
    });
});

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var browserifyOptions = {
    entries: ['./client/js/app.js'],
    debug: true
};
var options = _.assign({}, watchify.args, browserifyOptions);
var b = watchify(browserify(options));

gulp.task('build', bundle);
b.on('update', bundle);
b.on('log', util.log);

function bundle() {
    return b.bundle()
        .on('error', util.log.bind(util, 'Browserify Error'))
        .pipe(source('build.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./client'));
}