'use strict';

var _ = require('lodash');

var baseConfig = {
    basePath: __dirname,
    frameworks: ['jasmine'],
    plugins: [
        'karma-jasmine',
        'karma-phantomjs-launcher',
        'karma-mocha-reporter'
    ],
    browsers: [
        'PhantomJS'
    ],
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    concurrency: Infinity
};

var testFiles = ['./client/test/**/*.js'];

var allBrowsers = ['Chrome', 'Firefox', 'IE', 'PhantomJS'];

var allPlugins = [
    'karma-jasmine',
    'karma-phantomjs-launcher',
    'karma-chrome-launcher',
    'karma-firefox-launcher',
    'karma-ie-launcher',
    'karma-mocha-reporter'
];

function base() {
    return _.assign({},
        baseConfig,
        { files: testFiles },
        { singleRun: true },
        { autoWatch: false });
}

function browsers() {
    return _.assign({},
        baseConfig,
        { files: testFiles },
        { singleRun: true },
        { autoWatch: false },
        { plugins: allPlugins },
        { browsers: allBrowsers });
}

function tdd() {
    return _.assign({},
        baseConfig,
        { files: testFiles });
}

module.exports = {
    base: base(),
    browsers: browsers(),
    tdd: tdd()
};