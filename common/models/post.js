module.exports = function(Post) {
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
    }
};
