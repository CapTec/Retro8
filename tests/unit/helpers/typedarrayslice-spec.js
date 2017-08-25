define(function(require) {
  var polyfill = require('src/scripts/helpers/typedarrayslice');

  describe('slice', function() {
    it('it polyfills TypedArray.prototype.slice for Uint8Array type', function() {
      var old = Uint8Array.prototype.slice;
      Uint8Array.prototype.slice = undefined;

      var polyfilled = polyfill(Uint8Array);
      var test = new Uint8Array(12);
      test[10] = 14;
      test[11] = 15;

      var expected = new Uint8Array(2);
      expected[0] = 14;
      expected[1] = 15;

      var actual = test.slice(10, 12);

      expect(polyfilled).toBe(true);
      expect(actual).toEqual(expected);
      Uint8Array.prototype.slice = old;
    });
  });
});
