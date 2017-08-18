define(['./operations'], function(operations) {
  'use strict';

  var memoryLimit = 4096;
  var registerCount = 16;
  var width = 64;
  var height = 32;
  var font = [
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
    0xF0, 0x80, 0xF0, 0x80, 0x80  // F
  ];
  var keyboard = {
    0x1: { value: 0 },
    0x2: { value: 0 },
    0x3: { value: 0 },
    0xC: { value: 0 },
    0x4: { value: 0 },
    0x5: { value: 0 },
    0x6: { value: 0 },
    0xD: { value: 0 },
    0x7: { value: 0 },
    0x8: { value: 0 },
    0x9: { value: 0 },
    0xE: { value: 0 },
    0xA: { value: 0 },
    0x0: { value: 0 },
    0xB: { value: 0 },
    0xF: { value: 0 }
  };

  function Interpreter() {
    /* reduce flicker should return an alternate draw call function
     * The initial draw at x and y,
     * Start loop,
     * Store X and Y in XSaved and YSaved,
     * Alter X or Y due to keys,
     * if XSaved <> x or YSaved <> y then
     * Undraw object at XSaved and YSaved,
     * Redraw object at x and y,
     * Endif
     * Repeat Loop.
     */
  }

  Interpreter.prototype = {
    cycle: cycle,
    loadFont: loadFont,
    initDisplay: initDisplay,
    reset: reset,
    program_counter: 0x200,
    stack_pointer: 0,
    index_register: 0,
    stack: [],
    registers: new Uint8Array(registerCount),
    memory: new Uint8Array(memoryLimit),
    display: initDisplay(width, height),
    reduceFlicker: false,
    keyboard: Object.create(Object.prototype, keyboard),
    delayTimer: 0,
    soundTimer: 0
  };

  function reset() {
    this.program_counter = 0x200;
    this.stack = [];
    this.registers = new Uint8Array(registerCount);
    this.index_register = 0;
    this.memory = new Uint8Array(memoryLimit);
    this.display = initDisplay(width, height);
    this.keyboard = Object.create(Object.prototype, keyboard);
    this.delayTimer = 0;
    this.soundTimer = 0;
  }

  function initDisplay(w, h) {
    var display = new Array(w);
    for (var i = 0; i < w; i++) {
      display[i] = new Array(h);
      for (var j = 0; j < h; j++) {
        display[i][j] = 0;
      }
    }

    return display;
  }

  function cycle() {
    // need independent delay and sound timers that count down at 60Hz.
    // request animation frame should do this. Possibly shift the timers to their own
    // background workers. Additionally main emulation speed should be 1.75MHz / 60Hz = ops/sec
    // wait until the next vsync for any more.

    var opcode = this.memory[this.program_counter] << 8;

    try {
      var op = operations.getOps(opcode);
    } catch (err) {
      // error occurred decoding the current opcode.
    }

    try {
      op.call(this, opcode);
    } catch (err) {
      // opcode execution logic error occurred. Handle appropriately
    }
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
