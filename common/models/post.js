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
        http: { path: '/:id', verb: 'post' },
        accepts: { arg: 'id', type: 'string', required: true, http: { source: 'path' } },
        returns: { root: true, type: 'object' },
        description: 'Increase a post\'s karma'
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
    
    // Call an operation hook that runs before each record is saved
    Post.observe('before save', function filterProperties(ctx, next) {
        // If there is a record in the context
        if (ctx.instance) {
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
