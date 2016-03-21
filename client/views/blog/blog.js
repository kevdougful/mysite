'use strict';

angular.module('kcoffey.blog', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/blog', {
        templateUrl: 'views/blog/blog.html',
        controller: 'BlogCtrl'
    });
}])
// Submit view controller
.controller('BlogCtrl', ['$scope',
function($scope) {

}]);