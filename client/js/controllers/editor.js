'use strict';
module.exports = 
['$scope', '$mdConstant', 'API', 'Upload', 'Dialog', 'ApiHelpers', 'Post', 'Tag', 'PostTag',
function($scope, $mdConstant, API, Upload, Dialog, ApiHelpers, Post, Tag, PostTag) {
    
    $scope.post = {};
    $scope.tags = [];
    $scope.createPost = createPost;
    $scope.separatorKeys = [
        $mdConstant.KEY_CODE.ENTER,
        $mdConstant.KEY_CODE.COMMA
    ];
    $scope.uploading = false;
    
    function upload(file) {
        return Upload.upload({
            url: API.URL + API.BUCKET.POST_IMAGES_UP,
            data: { file: file }
        });
    }
        
    function createPost(post, tags) {
        var tagObjs = [];
        for (var tag = 0; tag < tags.length; tag++) {
            tagObjs.push({ name: tags[tag] });
        }
        $scope.uploading = true;
        upload($scope.photo)
            .then(function(result) {
                if($scope.photo) {
                    post.imageUrl = encodeURI(
                        API.URL + API.BUCKET.POST_IMAGES_DOWN +
                        result.data.result.files.file[0].name
                    );  
                }
                return Post.create(post).$promise;
            })
            .then(function(newPost) {
                $scope.post = newPost;
                return ApiHelpers.fetchOrCreateArray(Tag, tagObjs);
            })
            .then(function(newTags) {
                var postTags = [];
                for (var newTag = 0; newTag < newTags.length; newTag++) {
                    postTags.push({
                        postId: $scope.post.id,
                        tagId: newTags[newTag].id
                    });
                }
                return ApiHelpers.fetchOrCreateArray(PostTag, postTags);
            })
            .then(function(newPostTags) {
                Dialog.notify('Post published', 3000);
                $scope.uploading = false; 
            })
            .catch(function(err) {
                Dialog.notify('Error!', 3000);
                $scope.uploading = false; 
            });
    }
    
}];