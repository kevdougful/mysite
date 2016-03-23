'use strict';

angular.module('kcoffey.ui', [])
.factory('Dialog', ['$mdToast', 
function($mdToast) {
    
    function notify(text, delay, actionText) {
        var toast = $mdToast.simple()
            .textContent(text)
            .action(actionText)
            .highlightAction(true)
            .position('bottom right')
            .hideDelay(delay);
        return $mdToast.show(toast);
    }
    
    return {
        notify: notify
    };
    
}]);