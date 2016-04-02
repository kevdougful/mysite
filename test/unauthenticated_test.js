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
        
        it('should return array of Posts with author', function(done) {
            request(app).get('/api/Posts?filter[include]=author')
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    res.body.should.include.something.that.has.property('author');
                    done();
                });
        });
        
        it('should return array of Posts with category', function(done) {
            request(app).get('/api/Posts?filter[include]=category')
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    res.body.should.include.something.that.has.property('category');
                    done();
                });
        });
        
        it('should return array of Posts with tags', function(done) {
            request(app).get('/api/Posts?filter[include]=tags')
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    res.body.should.include.something.that.has.property('tags');
                    done();
                });
        });
        
        it('should return array of Posts with comments', function(done) {
            request(app).get('/api/Posts?filter[include]=comments')
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    res.body.should.include.something.that.has.property('comments');
                    done();
                });
        });
        
        it('should not allow unauthenticated user to create post', function(done) {
            request(app).post('/api/Posts')
                .end(function(err, res) {
                    res.status.should.equal(401);
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
        
        it('should not be able to use myposts endpoint', function(done) {
            request(app).get('/api/Posts/myposts')
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
        
        it('should return array of Tags', function(done) {
            request(app).get('/api/Tags')
                .expect(200)
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    done();
                });
        });
        
        it('should not allow unauthenticated user to create Tag', function(done) {
            request(app).post('/api/Tags')
                .end(function(err, res) {
                    res.status.should.equal(401);
                    done();
                });
        });
        
        it('should return array of Tags with category', function(done) {
            request(app).get('/api/Tags?filter[include]=posts')
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    res.body.should.include.something.that.has.property('posts');
                    done();
                });
        });
            
    });
    
    describe('Categories:', function() {
        
        it('should return array of Categories', function(done) {
            request(app).get('/api/Categories')
                .expect(200)
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    done();
                });
        });
        
        it('should not allow unauthenticated user to create Categories', function(done) {
            request(app).post('/api/Categories')
                .end(function(err, res) {
                    res.status.should.equal(401);
                    done();
                });
        });
        
        it('should return array of Categories with posts', function(done) {
            request(app).get('/api/Categories?filter[include]=posts')
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    res.body.should.include.something.that.has.property('posts');
                    done();
                });
        });
        
    });
    
    describe('Comments:', function() {
        
        it('should return array of Comments', function(done) {
            request(app).get('/api/Comments')
                .expect(200)
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    done();
                });
        });
        
        it('should not allow unauthenticated user to create Comment', function(done) {
            request(app).post('/api/Comments')
                .end(function(err, res) {
                    res.status.should.equal(401);
                    done();
                });
        });
        
        it('should return array of Comments with post', function(done) {
            request(app).get('/api/Comments?filter[include]=post')
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    res.body.should.include.something.that.has.property('post');
                    done();
                });
        });
        
        it('should return array of Comments with commentor', function(done) {
            request(app).get('/api/Comments?filter[include]=commentor')
                .end(function(err, res) {
                    assert.instanceOf(res.body, Array);
                    res.body.should.include.something.that.has.property('commentor');
                    done();
                });
        });
        
    });

    

});
    