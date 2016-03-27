'use strict';

angular.module('kcoffey', [
    // Angular Dependencies
    'ngRoute', 'ngMaterial', 'ngMessages', 'ngFileUpload',
    // Services
    'kcoffey.ui', 'ApiService', 'kcoffey.api',
    // Views 
    'kcoffey.blog', 'kcoffey.editor'
])
.constant('API', {
    'URL': 'http://192.168.1.100/api/',
    'BUCKET': {
        'POST_IMAGES_UP': 'Buckets/post-images/upload/',
        'POST_IMAGES_DOWN': 'Buckets/post-images/download/'
    }
})
.config([
    '$routeProvider', '$locationProvider', '$mdIconProvider', '$httpProvider',
    'LoopBackResourceProvider', 'API',
function(
    $routeProvider, $locationProvider, $mdIconProvider, $httpProvider,
    LoopBackResourceProvider, API) {

    // Default Route
    $routeProvider.otherwise({ redirectTo: '/blog' });
    $locationProvider.html5Mode(true);
    
    // Loopback AngularJS SDK
    LoopBackResourceProvider.setAuthHeader('X-Access-Token');
    LoopBackResourceProvider.setUrlBase(API.URL);
    
    // CORS
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    // Icons
    $mdIconProvider.defaultIconSet('fonts/mdi.svg');
}])
.controller('AppCtrl', ['$scope', '$mdSidenav',
function($scope, $mdSidenav) {
    $scope.today = new Date();
    $scope.activeView = {};
    $scope.progressActive = true;
    $scope.openNav = function(navId) {
        $mdSidenav(navId).toggle().then(function() {});
    };
    $scope.closeNav = function(navId) {
        $mdSidenav(navId).close().then(function() {});
    } 
    
    $scope.setProgress = function(on) {
        $scope.progressActive = on ? true : false;
    };
    
    $scope.setActiveView = function(view) {
        for (var viewProp in $scope.activeView) {
            if ($scope.activeView.hasOwnProperty(viewProp)) {
                if (viewProp === view) {
                    $scope.activeView[viewProp] = true;
                } else {
                    $scope.activeView[viewProp] = false;
                }
            }
        }
    }
}]);