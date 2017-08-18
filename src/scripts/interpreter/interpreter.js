define(function(require) {
  'use strict';

  var operations = require('./operations'),
    font = require('./font'),
    keyboard = require('./keyboard'),
    memoryLimit = 4096,
    registerCount = 16,
    width = 64,
    height = 32,
    stackSize = 16,
    reset,
    cycle,
    loadFont,
    handleTimers;

  function Interpreter() {
    this.registers = initRegisters();
    this.memory = initMemory();
    this.display = initDisplay(width, height);
    this.keyboard = initKeyboard();
    this.stack = initStack();
  }

  Interpreter.prototype = {
    cycle: cycle,
    loadFont: loadFont,
    reset: reset,
    program_counter: 0x200,
    stack_pointer: 0,
    index_register: 0,
    initDisplay: initDisplay,
    initMemory: initMemory,
    initRegisters: initRegisters,
    initKeyboard: initKeyboard,
    initStack: initStack,
    delayTimer: 0,
    soundTimer: 0
  };

  reset = function reset() {
    this.program_counter = 0x200;
    this.stack = initStack();
    this.index_register = 0;
    this.registers = initRegisters();
    this.memory = initMemory();
    this.display = initDisplay(width, height);
    this.keyboard = initKeyboard();
    this.delayTimer = 0;
    this.soundTimer = 0;
  };

  function initStack() {
    return new Uint16Array(stackSize);
  }

  function initRegisters() {
    return new Uint8Array(registerCount);
  }

  function initMemory() {
    return new Uint8Array(memoryLimit);
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

  cycle = function cycle() {
    var opcode = this.memory[this.program_counter] << 8,
      op;

    try {
      op = operations.getOps(opcode); // decode
    } catch (err) {
      // error occurred decoding the current opcode.
    }

    try {
      op.call(this, opcode); // execute
    } catch (err) {
      // opcode execution logic error occurred. Handle appropriately
    }

    handleTimers.call(this);
  };

  /*
   * Decrements Chip8 timers if > 0
   */
  handleTimers = function handleTimers() {
    if (this.delayTimer > 0)
      this.delayTimer -= 1;

    if (this.soundTimer > 0) {
      if (this.soundTimer === 1) {
        //dispatch beep sound here.
      }
      this.soundTimer -= 1;
    }
  };

  /*
   * Fonts are loaded into the reserved intepreter memory
   * space (0x000 to 0x1FF)
   */
  loadFont = function loadFont() {
    var length = font.length;
    for (var i = 0; i < length; i++) {
      this.memory[i] = font[i];
    }
  };

  function initKeyboard() {
    return keyboard.keys();
  }

  return Interpreter;
});
