'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var loopbackAngularSdk = require('gulp-loopback-sdk-angular');

// Generate AngularJS service for API
gulp.task('api-service', function() {
    return gulp.src('./server/server.js')
        .pipe(loopbackAngularSdk({
            ngModuleName: 'ApiService'
        }))
        .pipe(rename('api-service.js'))
        .pipe(gulp.dest('./client/services'));
});