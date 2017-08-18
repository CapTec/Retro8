define(function(require) {
  var Interpreter = require('src/scripts/interpreter/interpreter'),
    keyboard = require('src/scripts/interpreter/keyboard'),
    font = require('src/scripts/interpreter/font');

  describe('new Interpreter', function() {
    var actual = new Interpreter();
    it('sets keyboard to default values', function() {
      var expected_keyboard = keyboard.keys();

      expect(actual.keyboard).toEqual(expected_keyboard);
    });

    it('sets program_counter = 0x200', function() {
      var expected_pc = 0x200;

      expect(actual.program_counter).toBe(expected_pc);
    });

    it('sets stack_pointer to 0', function() {
      var expected_sp = 0;

      expect(actual.stack_pointer).toEqual(expected_sp);
    });

    it('sets index_register to 0', function() {
      var expected_ir = 0;

      expect(actual.index_register).toEqual(expected_ir);
    });

    it('sets stack to empty array', function() {
      var expected_stack = Interpreter.prototype.initStack();

      expect(actual.stack).toEqual(expected_stack);
    });

    it('sets registers to empty Uint8(16) array', function() {
      var expected_registers = new Uint8Array(16);

      expect(actual.registers).toEqual(expected_registers);
    });

    it('sets memory to only contain font data', function() {
      var expected_memory = new Uint8Array(4096);
      for (var i = 0; i < font.length; i++) {
        expected_memory[i] = font[i];
      }

      expect(actual.memory).toEqual(expected_memory);
    });

    it('sets display to Uint8 64*32 2D array with default values of 0 (off pixels)', function() {
      var expected_display = new Array(64);
      for (var i = 0; i < 64; i++) {
        expected_display[i] = new Array(32);
        for (var j = 0; j < 32; j++) {
          expected_display[i][j] = 0;
        }
      }

      expect(actual.display).toEqual(expected_display);
    });

    it('set delayTimer to 0', function() {
      var expected_dt = 0;
      expect(actual.delayTimer).toBe(expected_dt);
    });

    it('set soundTimer to 0', function() {
      var expected_st = 0;
      expect(actual.soundTimer).toBe(expected_st);
    });
  });

  describe('reset sets defaults correctly', function() {
    var actual = new Interpreter();
    // change to arbitrary values
    actual.keyboard = {};
    actual.display = [];
    actual.program_counter = 0x202;
    actual.stack_pointer = 2;
    actual.stack[0] = 0x3E7;
    actual.index_register = 0xFB;
    actual.registers[0] = 0xAB;
    actual.delayTimer = 30;
    actual.soundTimer = 30;
    actual.reset();


    it('set keyboard to default values', function() {
      var expected_keyboard = keyboard.keys();

      expect(actual.keyboard).toEqual(expected_keyboard);
    });

    it('set program_counter = 0x200', function() {
      var expected_pc = 0x200;

      expect(actual.program_counter).toBe(expected_pc);
    });

    it('set stack_pointer to 0', function() {
      var expected_sp = 0;

      expect(actual.stack_pointer).toEqual(expected_sp);
    });

    it('set index_register to 0', function() {
      var expected_ir = 0;

      expect(actual.index_register).toEqual(expected_ir);
    });

    it('set stack to empty array', function() {
      var expected_stack = Interpreter.prototype.initStack();

      expect(actual.stack).toEqual(expected_stack);
    });

    it('set registers to empty Uint8(16) array', function() {
      var expected_registers = new Uint8Array(16);

      expect(actual.registers).toEqual(expected_registers);
    });

    it('set memory to only contain font data', function() {
      var expected_memory = new Uint8Array(4096);
      for (var i = 0; i < font.length; i++) {
        expected_memory[i] = font[i];
      }

      expect(actual.memory).toEqual(expected_memory);
    });

    it('set display to Uint8 64*32 2D array with default values of 0 (off pixels)', function() {
      var expected_display = new Array(64);
      for (var i = 0; i < 64; i++) {
        expected_display[i] = new Array(32);
        for (var j = 0; j < 32; j++) {
          expected_display[i][j] = 0;
        }
      }

      expect(actual.display).toEqual(expected_display);
    });

    it('set delayTimer to 0', function() {
      var expected_dt = 0;
      expect(actual.delayTimer).toBe(expected_dt);
    });

    it('set soundTimer to 0', function() {
      var expected_st = 0;
      expect(actual.soundTimer).toBe(expected_st);
    });
  });

  describe('cycle', function() {
    var actual = new Interpreter();

    it('performs decode/fetch/execute ops then updates timers', function() {
      actual.memory[0x200] = 0xF0;
      actual.memory[0x201] = 0x29;
      actual.registers[0] = 0x1; // we want to set index_register to font char 1
      actual.delayTimer = 1;
      actual.soundTimer = 1;
      var expected_pc = 0x202;
      var expected_ir = 0x5;

      actual.cycle();

      expect(actual.program_counter).toBe(expected_pc);
      expect(actual.index_register).toBe(expected_ir);
    });
  });
  describe('handleTimers', function() {
    var actual = new Interpreter();

    it('should decrement timers by 1 if > 0', function() {
      actual.delayTimer = 1;
      actual.soundTimer = 1;
      var expected_dt = 0;
      var expected_st = 0;

      actual.handleTimers();

      expect(actual.delayTimer).toBe(expected_dt);
      expect(actual.soundTimer).toBe(expected_st);
    });

    it('should not decrement timers if 0', function() {
      actual.delayTimer = 0;
      actual.soundTimer = 0;
      var expected_dt = 0;
      var expected_st = 0;

      actual.handleTimers();

      expect(actual.delayTimer).toBe(expected_dt);
      expect(actual.soundTimer).toBe(expected_st);
    });
  });
});
