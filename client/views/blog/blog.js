'use strict';

angular.module('kcoffey.blog', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/blog', {
        templateUrl: 'views/blog/blog.html',
        controller: 'BlogCtrl'
    });
}])
// Submit view controller
.controller('BlogCtrl', ['$scope', 'API', 'Post', 'Dialog',
function($scope, API, Post, Dialog) {
    $scope.posts = [];
    
    API.fetch(Post)
        .then(function(posts) {
            $scope.posts = posts;
        })
        .catch(function(err) {
            Dialog.notify('Error loading posts...', 3000);
        });

}]);