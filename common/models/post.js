var loopback = require('loopback');

module.exports = function(Post) {
    
    Post.validatesPresenceOf('authorId');       // Post must have an author
    Post.validatesPresenceOf('categoryId');     // Post must have belong to category
    
    // Publish: Mark a post as published
    Post.remoteMethod('publish', {
        http: { path: '/:id/publish', verb: 'put' },
        accepts: { arg: 'id', type: 'string', required: true, http: { source: 'path' }},
        returns: { root: true, type: 'object' },
        description: 'Marks a post as published.' 
    });
    Post.publish = function(id, callback) {
        Post.findById(id, function(err, post) {
            post.updateAttributes({ published: true, datePublished: new Date() }, 
                function(err, instance) {
                    if (err) callback(err);
                    if (!err) callback(null, instance);
            });
        });
    };
    
    // Tag: Associate a tag object with a post
    Post.remoteMethod('tag', {
        http: { path: '/:id/tag/:name', verb: 'post' },
        accepts: [
            { arg: 'id', type: 'string', required: true, http: { source: 'path' }},
            { arg: 'name', type: 'string', required: true, http: { source: 'path' }}
        ],
        returns: { root: true, type: 'object' },
        description: 'Associates a tag with a post.'
    });
    Post.tag = function(id, name, callback) {
        
        var postObj;
        Post.findById(id)
            .then(function(post) {
                postObj = post;
                return Post.app.models.Tag.upsert({ name: name });
            })
            .then(function(tag) {
                return Post.app.models.PostTag.create({
                    postId: postObj.id,
                    tagId: tag.id
                });
            })
            .then(function(postTag) {
                return Post.findOne({
                    where: { id: postTag.postId },
                    include: 'tags'
                });
            })
            .then(function(postWithTags) {
                callback(null, postWithTags);
            })
            .catch(function(err) {
                callback(err);
            });
    };
    
    // Up Vote a post
    Post.remoteMethod('upvote', {
        http: { path: '/:id/upvote', verb: 'post' },
        accepts: { arg: 'id', type: 'string', required: true, http: { source: 'path' } },
        returns: { root: true, type: 'object' },
        description: 'Increase upvotes for a post'
    });
    Post.beforeRemote('upvote', function(ctx, user, next) {
        Post.findById(ctx.req.params.id, function(err, post) {
            // Do not let user upvote more than once
            if (post.upvotes.indexOf(ctx.req.accessToken.userId) != -1) {
                var err = new Error('User has already upvoted this post');
                err.status = 403;
                next(err);
            } else {
                next();
            }
        });
    });
    Post.upvote = function(id, callback) {
        var ctx = loopback.getCurrentContext();
        Post.findById(id, function(err, post) {
            post.upvotes.push(ctx.active.accessToken.userId);
            post.updateAttributes({
                numUpvotes: post.upvotes.length,
                upvotes: post.upvotes 
            }, function(err, instance) {
                if (err) callback(err);
                if (!err) callback(null, instance);
            });
        });
    };
    
    Post.remoteMethod('myposts', {
        http: { path: '/myposts', verb: 'get' },
        returns: { root: true },    
        description: 'Returns posts belonging to the authenticated author'
    });
    Post.myposts = function(callback) {
        var ctx = loopback.getCurrentContext();
        if (!ctx.active.accessToken) return callback(null, []);
        var userId = ctx.active.accessToken.userId;
        Post.find({ where: { authorId: userId } },
            function(err, posts) {
                if (err) callback(err);
                if (!err) callback(null, posts);
            });
    };
    
    function sanitize(arr, property, value) {
        var sanitized = [];
        for (var i = 0; i < arr.length; i++) {
            var element = arr[i];
            if(element[property] !== value) {
                sanitized.push(element);
            }
        }
        return sanitized;
    }
    
    Post.afterRemote('findById', function(ctx, user, next) {
        if (ctx.result.published !== true) ctx.result = null;
        next();
    });
    
    Post.afterRemote('findOne', function(ctx, user, next) {
        if (ctx.result.published !== true) ctx.result = null;
        next();
    });
    
    Post.afterRemote('find', function(ctx, user, next) {
        ctx.result = sanitize(ctx.result, 'published', false);
        next();
    });
    
    Post.afterRemote('exists', function(ctx, user, next) {
        var postId = ctx.req.params.id;
        Post.findById(postId).then(function(post) {
            if (!post.published) {
                ctx.result = { exists: false };
            }
            next();
        });
    });
    
    // Call an operation hook that runs before each record is saved
    Post.observe('before save', function filterProperties(ctx, next) {
        // If there is a record in the context
        if (ctx.instance) {
            var token = loopback.getCurrentContext().get('accessToken');
            // Set the Author (removes authorId if it was provided)
            var userId = loopback.getCurrentContext().get('accessToken').userId;
            ctx.instance.authorId = userId;
            // Ensure a valid datePosted
            if (ctx.instance.datePosted === undefined) {
                ctx.instance.datePosted = new Date();
            }
            // Ensure that upvotes is an empty array
            if (ctx.instance.upvotes === undefined) {
                ctx.instance.upvotes = [];
            }
        }
        next();
    });
    
};
