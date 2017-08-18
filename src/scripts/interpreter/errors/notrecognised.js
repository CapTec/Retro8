define(function() {
  'use strict';

  function CodeNotRecognised(opcode) {
    this.name = 'CodeNotRecognised';
    this.message = 'The opcode 0x' + opcode.toString(16).toUpperCase() + ' is not recognised.';
    this.stack = (new Error()).stack;
  }

  CodeNotRecognised.prototype = Object.create(Error.prototype);
  CodeNotRecognised.prototype.constructor = CodeNotRecognised;

  return CodeNotRecognised;
});
