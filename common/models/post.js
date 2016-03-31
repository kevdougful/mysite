module.exports = function(Post) {
    
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
        http: { path: '/:id/tag', verb: 'post' },
        accepts: [
            { arg: 'id', type: 'string', required: true, http: { source: 'path' }},
            { arg: 'tag', type: 'object', required: true, http: { source: 'body' }}
        ],
        returns: { root: true, type: 'object' },
        description: 'Associates a tag object with a post.'
    });
    Post.tag = function(id, tag, callback) {
        Post.findById(id, function(err, post) {
            Post.app.models.PostTag.create({ postId: id, tagId: tag.id },
                function(err, instance) {
                    if (err) {
                        callback(err);
                    } else {
                        Post.find({ where: { id: id }, include: ['tags'] }, function(err, postWithTags) {
                            callback(null, postWithTags);
                        });
                    }
            });
        });
    };
};
