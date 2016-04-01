'use strict';

var app = require('../server/server.js');
var should = require('chai').should();
var assert = require('chai').assert;
var request = require('supertest');

describe('Unauthenticated User', function() {
    
    describe('Posts', function() {
        
        it('returns array of Posts', function(done) {
            request(app).get('/api/Posts')
                .expect(200)
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    done();
                });
        });
        
        it('should not return unpublished Posts', function(done) {
            request(app).get('/api/Posts?filter[where][published]=false')
                .end(function(err, res) {
                    assert.lengthOf(res.body, 0);
                    done();
                });
        });
            
    });
    
    describe('Tags', function() {
        
    });
    
    describe('Categories', function() {
        
    });
    
    describe('Comments', function() {
        
    });

    

});
    