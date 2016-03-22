'use strict';

angular.module('kcoffey.editor', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/editor', {
        templateUrl: 'views/editor/editor.html',
        controller: 'EditorCtrl'
    });
}])
// Submit view controller
.controller('EditorCtrl', ['$scope',
function($scope) {
    $scope.post = {
        tags: []
    };
}]);