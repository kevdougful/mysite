'use strict';

var app = require('angular').module('kcoffey');

app.factory('ApiHelpers', require('./api-helpers'));
app.factory('Dialog', require('./dialog'));