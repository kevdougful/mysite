'use strict';

var path = require('path');

module.exports = function(server) {
    server.get('/blog', function(req, res) {
        res.sendFile(path.join(__dirname, '../../client/index.html'));
    });
};