'use strict';

angular.module('kcoffey', [
    'ngRoute', 'ngMaterial', 'ngMessages',
    'kcoffey.blog'
])
.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
    // Default Route
    $routeProvider.otherwise({ redirectTo: '/blog' });
    $locationProvider.html5Mode(true);
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