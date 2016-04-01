'use strict';

var app = require('../server/server.js');
var Post = app.models.Post;
var Tag = app.models.Tag;
var BlogUser = app.models.BlogUser;
var Role = app.models.Role;
var Comment = app.models.Comment;
var Category = app.models.Category;
var PostTag = app.models.PostTag;
var Bucket = app.models.Bucket;

function createUsers() {
    var testUsers, testRoles;
    return BlogUser.create([
        {
            id: 1,
            username: 'blogAdmin',
            email: 'blogAdmin@kcoffey.com',
            password: 'password',
            firstName: 'Admin' 
        },
        {
            id: 2,
            username: 'blogAuthor',
            email: 'blogAuthor@kcoffey.com',
            password: 'password',
            firstName: 'Author' 
        },
        {
            id: 3,
            username: 'blogUser',
            email: 'blogUser@kcoffey.com',
            password: 'password',
            firstName: 'User' 
        }
    ])
    .then(function(users) {
        testUsers = users;
        return Role.create([
            {
                id: 1,
                name: 'admin',
                description: 'Blog Administrator'
            },
            {
                id: 2,
                name: 'author',
                description: 'Blog Author'
            }
        ]);
    })
    .then(function(roles) {
        testRoles = roles;
        return testRoles[0].principals.create({
            principalType: 'user',
            principalId: testUsers[0]
        });
    })
    .then(function(principal) {
        return testRoles[1].principals.create({
            principalType: 'user',
            principalId: testUsers[1]
        });
    })
    .then(function() {
        return testUsers;
    })
    .catch(function(err) {
        throw err;
    });
}

before(function(done) {
    createUsers()
        .then(function(users) {
            
        })
        .finally(function() {
            done();
        })
        .catch(function(err) {
            throw err;
        });
});

after(function(done) {
    BlogUser.destroyAll();
    done();
})