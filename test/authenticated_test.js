'use strict';

var app = require('../server/server.js');
var request = require('supertest');
var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
chai.use(require('chai-things'));

var BlogUser = app.models.BlogUser;

describe('Authenticated User -', function() {
    
    var accessToken;
    var blogUser = {
        username: 'blogUser',
        password: 'password'
    };
    
    before(function(done) {
        BlogUser.login({
            username: blogUser.username,
            password: blogUser.password
        }, function(err, result) {
            if (err) console.log(err);
            accessToken = result.id;
            done();
        });
    });
        
    
    describe('Posts:', function() {
        
        it('should not allow authenticated user to create Posts', function(done) {
            request(app).post('/api/Posts?access_token=' + accessToken)
                .end(function(err, res) {
                    res.status.should.equal(401);
                    done();
                });
        });
                    
    });
    
    describe('Tags:', function() {
        
        it('should not allow authenticated user to create Tags', function(done) {
            request(app).post('/api/Tags?access_token=' + accessToken)
                .end(function(err, res) {
                    res.status.should.equal(401);
                    done();
                });
        });
           
    });
    
    describe('Categories:', function() {
        
        it('should not allow authenticated user to create Categories', function(done) {
            request(app).post('/api/Categories?access_token=' + accessToken)
                .end(function(err, res) {
                    res.status.should.equal(401);
                    done();
                });
        });
           
    });
    
    describe('Comments:', function() {
        
        it('should allow authenticated user to create Comments', function(done) {
            request(app).post('/api/Comments?access_token=' + accessToken)
                .send({
                    content: 'content',
                    postId: '4yzBQvtAg'
                })
                .end(function(err, res) {
                    res.status.should.equal(200);
                    done();
                });
        });           
        
        it('should set commentor from access token', function(done) {
            request(app).post('/api/Comments?access_token=' + accessToken)
                .send({
                    content: 'content',
                    postId: '4yzBQvtAg'
                })
                .end(function(err, res) {
                    res.body.should.have.property('commentorId');
                    done();
                });
        });
           
    });
        
            
});
    