'use strict';

describe('sample test', function() {
    
    it('should be true', function() {
        expect(true).toBe(true);            
    });
       
    
    it('should be false', function() {
        expect(1 == 2).toBe(false);            
    });
    
    it('should be one', function() {
        expect(2).toEqual(2);            
    });
        
});
    