define(function() {
  'use strict';

  /*
   * Returns a shallow copy of a portion of  a typed array into a new typed array object.
   *
   * @param {number} begin - Zero-based index at which to begin extraction.
   *                         A negative index can be used, indicating an offset
   *                         from the end of the sequence.
   *
   * @param {number} end - Zero-based index before which to end extraction.
   *                       slice extracts up to but not including end.
   * @returns A new typed array containing the extracted elements.
   */
  function slice(begin, end) {
    var arr = Array.prototype.slice.call(this, begin, end);
    var sliced = new this.constructor(arr.length);

    for(var i = 0; i < this.length; i++) {
      sliced[i] = arr[i];
    }

    return sliced;
  }

  function polyfillTypedArray(ArrayType) {
    if (typeof ArrayType.prototype.slice !== 'undefined')
      return false;

    ArrayType.prototype.slice = slice;
    
    return true;
  }

  return polyfillTypedArray;
});
