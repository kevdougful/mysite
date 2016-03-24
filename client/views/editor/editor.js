'use strict';

angular.module('kcoffey.editor', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/editor', {
        templateUrl: 'views/editor/editor.html',
        controller: 'EditorCtrl'
    });
}])
// Submit view controller
.controller('EditorCtrl', ['$scope', '$mdConstant', 'Upload', 'Dialog', 'API', 'Post', 'Tag', 'PostTag',
function($scope, $mdConstant, Upload, Dialog, API, Post, Tag, PostTag) {
    $scope.post = {};
    $scope.tags = [];
    $scope.createPost = createPost;
    $scope.separatorKeys = [
        $mdConstant.KEY_CODE.ENTER,
        $mdConstant.KEY_CODE.COMMA
    ];
    $scope.uploading = false;
    
    function upload(file) {
        $scope.photo.upload = Upload.upload({
            url: 'http://127.0.0.1/api/Buckets/post-images/upload',
            data: {
                file
            }
        });
        return $scope.photo;
    }
        
    function createPost(post, tags) {
        var tagObjs = [];
        for (var tag = 0; tag < tags.length; tag++) {
            tagObjs.push({ name: tags[tag] });
        }
        upload($scope.photo);
        $scope.uploading = true;
        $scope.photo.upload
            .then(function(result) {
                var url = 
                    'api/Buckets/post-images/download/' +
                    result.data.result.files.file[0].name;
                post.imageUrl = encodeURI(url);
                $scope.uploading = false;
                return API.create(Post, post);  
            })
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