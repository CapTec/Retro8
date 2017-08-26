define(function(require) {
  'use strict';
  var keymap = require('./keymap'),
    handle;

  function KeyboardHandler(keyboard) {
    this.keyboard = keyboard;
    this.handle = handle.bind(undefined, this);
  }

  KeyboardHandler.prototype = {
    addListeners: function addListeners(doc) {
      doc.addEventListener('keydown', this.handle);
      doc.addEventListener('keyup', this.handle);
      doc.addEventListener('keypress', this.handle);
    },
    removeListeners: function removeListeners(doc) {
      doc.removeEventListener('keydown', this.handle);
      doc.removeEventListener('keyup', this.handle);
      doc.removeEventListener('keypress', this.handle);
    }
  };

  handle = function handle(self, event) {
    if (!keymap[event.key])
      return;

    var key = keymap[event.key];

    if (event.type === 'keydown') {
      self.keyboard[key] = 0x1;
    } else if (event.type === 'keyup') {
      self.keyboard[key] = 0x0;
    }
  };

  return KeyboardHandler;
});
