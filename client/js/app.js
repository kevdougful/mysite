'use strict';

var angular = require('angular');
var ngMocks = require('angular-mocks');

// Load NPM dependencies
var ngRoute = require('angular-route');
var ngMaterial = require('angular-material');
var ngMessages = require('angular-messages');
var ngResource = require('angular-resource');
var ngFileUpload = require('ng-file-upload');

// Get the name of the LoopBack services module
// It'd be nice to be able to just require all the generated services...
// https://github.com/strongloop/loopback-sdk-angular/issues/200
var lbSdkModule = require('./loopback-sdk');

var app = angular.module('kcoffey', [
    // Angular Dependencies
    ngRoute, ngMaterial, ngMessages, ngFileUpload,
    // LoopBack Services
    lbSdkModule
])

// Load application dependencies
require('./services');
require('./controllers');


// API URL Constants
app.constant('API', {
    'URL': 'http://192.168.1.100/api/',
    'BUCKET': {
        'POST_IMAGES_UP': 'Buckets/post-images/upload/',
        'POST_IMAGES_DOWN': 'Buckets/post-images/download/'
    }
});

app.config([
    '$routeProvider', '$locationProvider', '$mdIconProvider', '$httpProvider',
    'LoopBackResourceProvider', 'API',
function(
    $routeProvider, $locationProvider, $mdIconProvider, $httpProvider,
    LoopBackResourceProvider, API) {

    // Routes
    $routeProvider.when('/blog', {
        templateUrl: 'views/blog.html',
        controller: 'BlogCtrl'
    });
    $routeProvider.when('/editor', {
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl'
    });
    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    });
    $routeProvider.otherwise({ redirectTo: '/blog' });
    $locationProvider.html5Mode(true);
    
    // Loopback AngularJS SDK
    LoopBackResourceProvider.setAuthHeader('X-Access-Token');
    LoopBackResourceProvider.setUrlBase(API.URL);
    
    // Looback AngularJS SDK Auth
    $httpProvider.interceptors.push(
        ['$q', '$location', 'LoopBackAuth', 
        function($q, $location, LoopBackAuth) {
            return {
                responseError: function(rejection) {
                    if (rejection.status == 401) {
                        LoopBackAuth.clearUser();
                        LoopBackAuth.clearStorage();
                        $location.nextAfterLogin = $location.path();
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
                }
            };
    }]);
    
    // CORS
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    // Icons
    $mdIconProvider.defaultIconSet('fonts/mdi.svg');
}]);