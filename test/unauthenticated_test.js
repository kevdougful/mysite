'use strict';

var app = require('../server/server.js');
var should = require('chai').should();
var assert = require('chai').assert;
var request = require('supertest');
//var api = supertest('http://localhost/api');

describe('Unauthenticated User', function() {
    
    before(function(done) {
        require('./setup');
        done();
    });
    
    describe('Posts', function() {
        
        it('returns array of Posts', function(done) {
            request(app).get('/api/Posts')
                .expect(200)
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    done();
                });
        });
        
    });

});
    