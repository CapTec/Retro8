define(function(require) {
  var AsyncBinLoader = require('src/scripts/helpers/asyncbinloader');

  describe('AsyncBinLoader', function() {
    it('should load binary file', function(done) {
      var loader = new AsyncBinLoader(); // need to mock XMLHttpRequest, this does a real request!
      var expected_type = Uint8Array;

      loader.load('base/src/binaries/INVADERS.ch8', function(actual) {
        expect(actual.constructor).toBe(expected_type);
        done();
      });
    });
  });
});
