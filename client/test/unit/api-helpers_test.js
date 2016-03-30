'use strict';

describe('API Helpers Service', function() {
    
    var ApiHelpers, Post;
    
    beforeEach(function() {
        module('kcoffey');
        module('ApiServices');
    });
        
    
    beforeEach(inject(function(_ApiHelpers_, _Post_){
        ApiHelpers = _ApiHelpers_;
        Post = _Post_;
    }));
    
    describe('ApiHelpers.fetchOrCreate', function() {
        
        beforeEach(function() {
            sinon.spy(ApiHelpers, 'fetchOrCreate');
            sinon.spy(ApiHelpers, 'fetchOrCreateArray');
            sinon.spy(Post, 'find');
        });
        
        afterEach(function() {
            ApiHelpers.fetchOrCreate.restore();
            ApiHelpers.fetchOrCreateArray.restore();
            Post.find.restore();
        });
            
        it('should be rejected if nothing passed', function() {
            chai.expect(ApiHelpers.fetchOrCreate()).to.be.rejected;
        });
        
        it('should call <Service>.find', function() {
            ApiHelpers.fetchOrCreate(Post, { id: 1 })
            chai.expect(Post.find).to.have.been.called;
        });
            
    });
        
});
    