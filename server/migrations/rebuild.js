'use strict';

var server = require('../server');
var ds = server.dataSources.db;

if (ds.connected) {
    rebuild();
} else {
    ds.once('connected', function() {
        rebuild();
    });
}

function rebuild() {
    ds.isActual(function(err, inSync) {
        if (!inSync) {
            ds.automigrate(function(err, result) {
                if (err) {
                    throw err;
                } else {
                    ds.disconnect();
                }
            });
        }
    });
}