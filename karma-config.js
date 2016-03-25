'use strict';

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
    var config = baseConfig;
    config.files = testFiles;
    config.singleRun = true;
    config.autoWatch = false;
    return config;
}

function browsers() {
    var config = baseConfig;
    config.files = testFiles;
    config.singleRun = true;
    config.autoWatch = false;
    config.plugins = allPlugins;
    config.browsers = allBrowsers;
    console.log(config);
    return config;
}

function tdd() {
    var config = baseConfig;
    config.files = testFiles;
    return config;
}

module.exports = {
    base: base(),
    browsers: browsers(),
    tdd: tdd()
};