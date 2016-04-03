'use strict';

module.exports = 
['$scope', '$mdSidenav', '$mdOpenMenu', 'Session', 'BlogUser', 'Dialog',
function($scope, $mdSidenav, $mdOpenMenu, Session, BlogUser, Dialog) {
    
    $scope.today = new Date();
    $scope.activeView = {};
    $scope.progressActive = true;
    $scope.openNav = function(navId) {
        $mdSidenav(navId).toggle().then(function() {});
    };
    $scope.closeNav = function(navId) {
        $mdSidenav(navId).close().then(function() {});
    } 
    
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
    
    $scope.openAccountMenu = function($mdOpenMenu, e) {
        $mdOpenMenu(e);
    };
    
    $scope.currentUser = null;
    if (BlogUser.isAuthenticated()) {
        BlogUser.getCurrent().$promise
            .then(function(user) {
                $scope.currentUser = user;
            });
    }
    
    $scope.setCurrentUser = function(user) {
        Session.create(user);
        $scope.currentUser = user;
    };
    
    $scope.logout = function() {
        BlogUser.logout().$promise
            .then(function() {
                Session.destroy();
                $scope.currentUser = null;
            })
            .catch(function(err) {
                Dialog.notify('Error logging out', 3000);
            });
    };

}];