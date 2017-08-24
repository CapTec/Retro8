define(function() {
  'use strict';

  function NotEnoughMemory(actual, limit) {
    this.name = 'NotEnoughMemory';
    this.message = actual + ' KiB exceeds the limit of ' + limit + ' KiB of writable memory.';
    this.stack = (new Error()).stack;
  }

  NotEnoughMemory.prototype = Object.create(Error.prototype);
  NotEnoughMemory.prototype.constructor = NotEnoughMemory;

  return NotEnoughMemory;
});
