'use strict';

var app = require('angular').module('kcoffey');

app.controller('AppCtrl', require('./app'));
app.controller('BlogCtrl', require('./blog'));
app.controller('EditorCtrl', require('./editor'));