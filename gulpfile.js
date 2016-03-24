'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var loopbackAngularSdk = require('gulp-loopback-sdk-angular');
var exec = require('child_process').exec;

// Generate AngularJS service for API
gulp.task('api-service', function() {
    return gulp.src('./server/server.js')
        .pipe(loopbackAngularSdk({
            ngModuleName: 'ApiService'
        }))
        .pipe(rename('api-service.js'))
        .pipe(gulp.dest('./client/services'));
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