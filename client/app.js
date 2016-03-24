'use strict';

angular.module('kcoffey', [
    // Angular Dependencies
    'ngRoute', 'ngMaterial', 'ngMessages', 'ngFileUpload',
    // Services
    'kcoffey.ui', 'ApiService', 'kcoffey.api',
    // Views 
    'kcoffey.blog', 'kcoffey.editor'
])
.config([
    '$routeProvider', '$locationProvider', '$mdIconProvider',
    'LoopBackResourceProvider',
function(
    $routeProvider, $locationProvider, $mdIconProvider,
    LoopBackResourceProvider) {

    // Default Route
    $routeProvider.otherwise({ redirectTo: '/blog' });
    $locationProvider.html5Mode(true);
    
    // Loopback AngularJS SDK
    LoopBackResourceProvider.setAuthHeader('X-Access-Token');
    LoopBackResourceProvider.setUrlBase('http://127.0.0.1/api');
    
    // Icons
    $mdIconProvider.defaultIconSet('fonts/mdi.svg');
}])
.controller('AppCtrl', ['$scope', 
function($scope) {
    $scope.today = new Date();
    $scope.activeView = {

    };
    
    $scope.progressActive = true;
    
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