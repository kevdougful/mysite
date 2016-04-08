'use strict';

module.exports = 
[function() {
    this.create = function(user) {
        this.user = user;
    };
    this.destroy = function() {
        this.user = null;
    };
}];