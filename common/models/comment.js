var loopback = require('loopback');
var shortid = require('shortid');

module.exports = function(Comment) {
    
    Comment.validatesPresenceOf('postId');      // Comment must have post
    Comment.validatesPresenceOf('commentorId'); // Comment must have commentor
    
    // Up Vote a comment
    Comment.remoteMethod('upvote', {
        http: { path: '/:id', verb: 'post' },
        accepts: { arg: 'id', type: 'string', required: true, http: { source: 'path' } },
        returns: { root: true, type: 'object' },
        description: 'Increase a comment\'s karma'
    });
    Comment.beforeRemote('upvote', function(ctx, user, next) {
        Comment.findById(ctx.req.params.id, function(err, comment) {
            // Do not let user upvote more than once
            if (comment.upvotes.indexOf(ctx.req.accessToken.userId) != -1) {
                var err = new Error('User has already upvoted this comment');
                err.status = 403;
                next(err);
            } else {
                next();
            }
        });
    });
    Comment.upvote = function(id, callback) {
        var ctx = loopback.getCurrentContext();
        Comment.findById(id, function(err, comment) {
            comment.upvotes.push(ctx.active.accessToken.userId);
            comment.updateAttributes({
                numUpvotes: comment.upvotes.length,
                upvotes: comment.upvotes 
            }, function(err, instance) {
                if (err) callback(err);
                if (!err) callback(null, instance);
            });
        });
    };
    
    // Call an operation hook that runs before each record is saved
    Comment.observe('before save', function filterProperties(ctx, next) {
        // If there is a record in the context
        if (ctx.instance) {
            var token = loopback.getCurrentContext().get('accessToken');
            // Set the commentor (removes commentorId if it was provided)
            var userId = loopback.getCurrentContext().get('accessToken').userId;
            ctx.instance.commentorId = userId;
            // Ensure a valid datePosted
            if (ctx.instance.datePosted === undefined) {
                ctx.instance.datePosted = new Date();
            }
            // Ensure that upvotes is an empty array
            if (ctx.instance.upvotes === undefined) {
                ctx.instance.upvotes = [];
            }
            if (ctx.isNewInstance) {
                ctx.instance.id = shortid.generate();
            }  
        }
        next();
    });
    
};
