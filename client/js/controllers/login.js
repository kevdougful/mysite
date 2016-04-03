'use strict';

module.exports =
['$scope', '$location', 'BlogUser', 'Dialog',
function($scope, $location, BlogUser, Dialog) {
    $scope.credentials = {};
    $scope.rememberMe = false;
    $scope.login = login;
    
    function login(credentials) {
        BlogUser.login(credentials).$promise
            .then(function(token) {
                var next = $location.nextAfterLogin || '/';
                $location.nextAfterLogin = null;
                $location.path(next);
                return BlogUser.getCurrent().$promise;
            })
            .then(function(user) {
                $scope.setCurrentUser(user);
            })
            .catch(function(err) {
                Dialog.notify('Login error', 5000);
            });
    }
}];