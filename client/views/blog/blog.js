'use strict';

angular.module('kcoffey.blog', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/blog', {
        templateUrl: 'views/blog/blog.html',
        controller: 'BlogCtrl'
    });
}])
// Submit view controller
.controller('BlogCtrl', ['$scope', 'Post', 'Dialog',
function($scope, Post, Dialog) {
    $scope.posts = [];
    
    Post.find().$promise
        .then(function(posts) {
            $scope.posts = posts;
        })
        .catch(function(err) {
            Dialog.notify('Error loading posts...', 3000);
        });

}]);