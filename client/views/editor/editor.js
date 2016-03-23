'use strict';

angular.module('kcoffey.editor', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/editor', {
        templateUrl: 'views/editor/editor.html',
        controller: 'EditorCtrl'
    });
}])
// Submit view controller
.controller('EditorCtrl', ['$scope', 'Dialog', 'API', 'Post', 'Tag', 'PostTag',
function($scope, Dialog, API, Post, Tag, PostTag) {
    $scope.post = {};
    $scope.tags = [];
    $scope.createPost = createPost;
    
    function createPost(post, tags) {
        var tagObjs = [];
        for (var tag = 0; tag < tags.length; tag++) {
            tagObjs.push({ name: tags[tag] });
        }
        API.create(Post, post)
            .then(function(newPost) {
                $scope.post = newPost;
                return API.fetchOrCreateArray(Tag, tagObjs);
            })
            .then(function(newTags) {
                var postTags = [];
                for (var newTag = 0; newTag < newTags.length; newTag++) {
                    postTags.push({
                        postId: $scope.post.id,
                        tagId: newTags[newTag].id
                    });
                }
                return API.fetchOrCreateArray(PostTag, postTags);
            })
            .then(function(newPostTags) {
                Dialog.notify('Post published', 3000);
            })
            .catch(function(err) {
                Dialog.notify('Error!', 3000);
            });
    }
    
}]);