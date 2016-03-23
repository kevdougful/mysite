'use strict';

angular.module('kcoffey.api', [])
.factory('API', ['$q', function($q) {
    
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
        service.find({ filter: filter },
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
    
    function fetchOrCreate(service, obj) {
        //console.log(obj);
        var deferred = $q.defer();
        service.find({ filter: { where: obj } },
            // Response returned
            function(data) {
                if (data.length > 0) {
                    // Object(s) found, resolve with first
                    deferred.resolve(data[0]);
                } else {
                    // No objects found, create one
                    service.create(obj,
                        // Success
                        function(newObj) {
                           deferred.resolve(newObj); 
                        },
                        // Error
                        function(err) {
                            deferred.reject(err);
                        });
                }
            },
            // Error
            function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }
    
    function fetchOrCreateArray(service, arr) {
        var promises = [];
        for (var i = 0; i < arr.length; i++) {
            promises.push(fetchOrCreate(service, arr[i]));
        }
        return $q.all(promises); 
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
        fetchOrCreate: fetchOrCreate,
        fetchOrCreateArray: fetchOrCreateArray,
        destroy: destroy
    };
    
}]);