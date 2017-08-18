define(function() {
  'use strict';

  function CodeNotImplemented(opcode) {
    this.name = 'CodeNotImplemented';
    this.message = 'The opcode 0x' + opcode.toString(16).toUpperCase() + ' has not yet been implemented';
    this.stack = (new Error()).stack;
  }

  CodeNotImplemented.prototype = Object.create(Error.prototype);
  CodeNotImplemented.prototype.constructor = CodeNotImplemented;

  return CodeNotImplemented;
});
