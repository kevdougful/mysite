'use strict';

var gulp = require('gulp');
var _ = require('lodash');
var rename = require('gulp-rename');
var loopbackAngularSdk = require('gulp-loopback-sdk-angular');
var install = require('gulp-install');
var util = require('gulp-util')
var exec = require('child_process').exec;
var Server = require('karma').Server;

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

var karmaConfig = require('./karma-config');

// Run Karma on PhantomJS
gulp.task('test', function(done) {
    new Server(karmaConfig.base, done).start();
});

// Run Karma with karma.conf.js
gulp.task('test-browsers', function(done) {
    new Server(karmaConfig.browsers, done).start();
});

// Watch for file changes and re-run tests on changes
gulp.task('tdd', function(done) {
    new Server(karmaConfig.tdd, done).start();
});