'use strict';

var app = require('../server/server.js');
var request = require('supertest');
var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
chai.use(require('chai-things'));

describe('Unauthenticated User -', function() {
    
    describe('Posts:', function() {
        
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
                    res.body.should.not.include.something.that.deep.equals({ published: false });
                    done();
                });
        });
        
        it('should return 404 if unpublished Post queried by id', function(done) {
            request(app).get('/api/Posts/1')
                .end(function(err, res) {
                    res.status.should.equal(404);
                    done();
                });
        });
        
        it('Posts/:id/exists should return false if post unpublished', function(done) {
            request(app).get('/api/Posts/1/exists')
                .end(function(err, res) {
                    res.body.should.have.property('exists', false);
                    done();
                });
        });
        
        it('should not allow unauthenticated user to publish post', function(done) {
            request(app).put('/api/Posts/1/publish')
                .end(function(err, res) {
                    res.status.should.equal(401)
                    done();
                });
        });
        
        it('should not be able to use myposts endpoint', function() {
            request(app).put('/api/Posts/myposts')
                .end(function(err, res) {
                    res.status.should.equal(401)
                    done();
                });
        });
            
        
        it('should be able to get count of comments', function(done) {
            request(app).get('/api/Posts/1/comments/count')
                .end(function(err, res) {
                    res.status.should.equal(200);
                    assert.property(res.body, 'count');
                    done();
                });
        });
                 
    });
    
    describe('Tags:', function() {
        
    });
    
    describe('Categories:', function() {
        
    });
    
    describe('Comments:', function() {
        
    });

    

});
    