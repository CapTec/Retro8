define(['./operations'], function(operations) {
  'use strict';

  const font = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80 // F
  ];

  const width = 64;
  const height = 32;

  function Interpreter() {
    this.program_counter = 0x200;
    this.stack = [];
    this.registers = new Uint8Array(16);
    this.index_register = 0;
    this.memory = new Uint8Array(4096);
    this.display = initDisplay(width, height);
  }

  Interpreter.prototype = {
    cycle: cycle,
    decodeOp: decodeOp,
    loadFont: loadFont,
    initDisplay: initDisplay
  };

  function initDisplay(w, h) {
    var display = new Array(w);
    for (var i = 0; i < w; i++) {
      display[i] = new Array(h);
      for(var j = 0; j < h; j++) {
        display[i][j] = 0;
      }
    }

    return display;
  }

  function cycle() {
    // read from system memory
    // get operation for opcode
    // bind retrieved operation to this and call passing opcode
  }

  function decodeOp(opcode) {
    return operations.getOps(opcode);
  }

  /*
   * Fonts are loaded into the reserved intepreter memory
   * space (0x000 to 0x1FF)
   */
  function loadFont() {
    var length = font.length;
    for (var i = 0; i < length; i++) {
      this.memory[i] = font[i];
    }
  }

  return Interpreter;
});
