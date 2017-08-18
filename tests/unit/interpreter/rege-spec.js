define(function(require) {
  var rege = require('src/scripts/interpreter/rege'),
    Interpreter = require('src/scripts/interpreter/interpreter');

  describe('rege', function() {
    describe('getOps(0xEX9E)', function() {
      var opcode = 0xE09E;
      var actual = rege.getOps(opcode);

      it('should get skipIfVxPressed function', function() {
        var expected = 'skipIfVxPressed';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('increments program_counter by 4 if vx is pressed', function() {
        var state = {
          registers: Interpreter.prototype.initRegisters(),
          program_counter: 0,
          keyboard: {
            0xA: 1
          } // A key pressed
        };
        state.registers[0] = 0XA;
        var expected_pc = 4;

        actual.call(undefined, opcode, state);

        expect(state.program_counter).toBe(expected_pc);
      });

      it('increments program_counter by 2 if vx is not pressed', function() {
        var state = {
          registers: Interpreter.prototype.initRegisters(),
          program_counter: 0,
          keyboard: {
            0xA: 0
          } // A key pressed
        };
        state.registers[0] = 0XA;
        var expected_pc = 2;

        actual.call(undefined, opcode, state);

        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(0xEXA1)', function() {
      var opcode = 0xE0A1;
      var actual = rege.getOps(opcode);

      it('should get skipIfVxNotPressed function', function() {
        var expected = 'skipIfVxNotPressed';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('increments program_counter by 4 if vx is not pressed', function() {
        var state = {
          registers: Interpreter.prototype.initRegisters(),
          program_counter: 0,
          keyboard: {
            0xA: 0
          } // A key not pressed
        };
        state.registers[0] = 0xA;
        var expected_pc = 4;

        actual.call(undefined, opcode, state);

        expect(state.program_counter).toBe(expected_pc);
      });

      it('increments program_counter by 2 if vx is pressed', function() {
        var state = {
          registers: Interpreter.prototype.initRegisters(),
          program_counter: 0,
          keyboard: {
            0xA: 1
          } // A key not pressed
        };
        state.registers[0] = 0xA;
        var expected_pc = 2;

        actual.call(undefined, opcode, state);

        expect(state.program_counter).toBe(expected_pc);
      });
    });
  });
});
