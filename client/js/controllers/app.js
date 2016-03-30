'use strict';

module.exports = 
['$scope', '$mdSidenav',
function($scope, $mdSidenav) {
    
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
    
}];