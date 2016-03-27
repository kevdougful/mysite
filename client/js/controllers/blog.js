'use strict';

module.exports =
['$scope', 'Post', 'Dialog',
function($scope, Post, Dialog) {
    
    $scope.posts = [];
    
    Post.find().$promise
        .then(function(posts) {
            $scope.posts = posts;
        })
        .catch(function(err) {
            Dialog.notify('Error loading posts...', 3000);
        });

}];