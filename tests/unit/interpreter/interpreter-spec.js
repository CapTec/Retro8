define(function(require) {
  var Interpreter = require('src/scripts/interpreter/interpreter');

  describe('new Interpreter', function() {
    var chip8 = new Interpreter();
    it('sets keyboard to default values', function() {
      var expected_keyboard = {
        0x1: 0,
        0x2: 0,
        0x3: 0,
        0xC: 0,
        0x4: 0,
        0x5: 0,
        0x6: 0,
        0xD: 0,
        0x7: 0,
        0x8: 0,
        0x9: 0,
        0xE: 0,
        0xA: 0,
        0x0: 0,
        0xB: 0,
        0xF: 0
      };

      expect(chip8.keyboard).toEqual(expected_keyboard);
    });

    it('sets program_counter = 0x200', function() {

      var expected_pc = 0x200;

      expect(chip8.program_counter).toBe(expected_pc);
    });

    it('sets stack_pointer to 0', function() {
      var expected_sp = 0;

      expect(chip8.stack_pointer).toEqual(expected_sp);
    });

    it('sets index_register to 0', function() {
      var expected_ir = 0;

      expect(chip8.index_register).toEqual(expected_ir);
    });

    it('sets stack to empty array', function() {
      var expected_stack = Interpreter.prototype.initStack();

      expect(chip8.stack).toEqual(expected_stack);
    });

    it('sets registers to empty Uint8(16) array', function() {
      var expected_registers = new Uint8Array(16);

      expect(chip8.registers).toEqual(expected_registers);
    });

    it('sets memory to empty Uint8(4096) array', function() {
      var expected_memory = new Uint8Array(4096);

      expect(chip8.memory).toEqual(expected_memory);
    });

    it('sets display to Uint8 64*32 2D array with default values of 0 (off pixels)', function() {
      var expected_display = new Array(64);
      for (var i = 0; i < 64; i++) {
        expected_display[i] = new Array(32);
        for (var j = 0; j < 32; j++) {
          expected_display[i][j] = 0;
        }
      }

      expect(chip8.display).toEqual(expected_display);
    });


  });
});
