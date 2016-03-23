'use strict';

var server = require('../server');
var ds = server.dataSources.db;

ds.isActual(function(err, inSync) {
    if (!inSync) {
        ds.autoupdate(function(err, result) {
            if (err) {
                throw err;
            } else {
                ds.disconnect();
            }
        });
    }
});