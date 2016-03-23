'use strict';

angular.module('kcoffey.api')
.factory('API', ['$q', 'ApiService',
function($q, ApiService) {
    
    function create(service, obj) {
        var deferred = $q.defer();
        service.create(obj,
            // Success
            function(data) {
                deferred.resolve(data);
            },
            // Error
            function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }
    
    function fetch(service, filter) {
        var deferred = $q.defer();
        service.find(filter,
            // Success
            function(data) {
                deferred.resolve(data);
            },
            // Error
            function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }
    
    function destroy(service, objId) {
        var deferred = $q.defer();
        service.deleteById({ id: objId },
            // Success
            function(data) {
                deferred.resolve(data);
            },
            // Error
            function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }
    
    return {
        create: create,
        fetch: fetch,
        destroy: destroy
    };
}]);