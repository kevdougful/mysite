'use strict';

describe('Dialog Service', function() {
    
    var Dialog, $mdToast, simpleToast;
    
    beforeEach(module('kcoffey'));
    
    beforeEach(inject(function(_Dialog_, _$mdToast_) {
        Dialog = _Dialog_;
        $mdToast = _$mdToast_;
    }));
    
    describe('Dialog.notify', function() {
        
        beforeEach(function() {
            sinon.spy($mdToast, 'show');
        });
        
        afterEach(function() {
            $mdToast.show.restore();
        });
            
        it('should call $mdToast.show', function() {
            Dialog.notify('hello');
            expect($mdToast.show).to.have.been.called;
        });
        
        it('should not call $mdToast.show if no args', function() {
            Dialog.notify();
            chai.expect($mdToast.show).not.to.be.called;
        });
                    
    });
        
});
    