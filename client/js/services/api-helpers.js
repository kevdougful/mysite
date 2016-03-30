'use strict';

module.exports = 
['$q', 
function($q) {
      
    function fetchOrCreate(service, obj) {
        var deferred = $q.defer();
        if (!service || !obj) {
            deferred.reject('Specify a service and object to create');
        } else {
            service.find({ filter: { where: obj } }).$promise
                .then(function(data) {
                    if (data.length > 0) {
                        // Object(s) found, resolve with first
                        deferred.resolve(data[0]);
                    } else {
                        // No objects found, create one
                        service.create(obj).$promise
                            .then(function(newObj) {
                            deferred.resolve(newObj); 
                            })
                            .catch(function(err) {
                                deferred.reject(err);
                            });                        
                    }
                })
                .catch(function(err) {
                    deferred.reject(err);
                });
        }
        return deferred.promise;
    }
    
    function fetchOrCreateArray(service, arr) {
        var promises = [];
        for (var i = 0; i < arr.length; i++) {
            promises.push(fetchOrCreate(service, arr[i]));
        }
        return $q.all(promises); 
    }
    
    return {
        fetchOrCreate: fetchOrCreate,
        fetchOrCreateArray: fetchOrCreateArray
    };
    
}];