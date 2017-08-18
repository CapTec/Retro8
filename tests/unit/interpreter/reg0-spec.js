define(function(require) {
  var reg0 = require('src/scripts/interpreter/reg0'),
    CodeNotImplemented = require('src/scripts/interpreter/errors/notimplemented'),
    Interpreter = require('src/scripts/interpreter/interpreter');

  describe('reg0', function() {
    describe('getOps(0NNN)', function() {
      var opcode = 0x02EE;
      var actual = reg0.getOps(opcode);

      it('should get callRca if opcode is not 0x00E0 and is not 0x00EE', function() {
        var expected = 'callRca';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('callRca isn\'t well documented and isn\'t implemented', function() {
        var actualFunc = function() {
          return actual.call(null, opcode);
        };

        expect(actualFunc).toThrowError(CodeNotImplemented);
      });
    });

    describe('getOps(00E0)', function() {
      var opcode = 0x00E0;
      var actual = reg0.getOps(opcode);

      it('should get clearDisplay function', function() {
        var expected = 'clearDisplay';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should call clearDisplay and set all pixels to "off" (0) and inc pc + 2', function() {
        var state = {
          display: Interpreter.prototype.initDisplay(64, 32),
          program_counter: 0
        };
        var expected_pc = 2;

        actual.call(undefined, opcode, state);
        expect(state.display[0][0]).toBe(0); // top left
        expect(state.display[63][0]).toBe(0); // top right
        expect(state.display[0][31]).toBe(0); // bottom left
        expect(state.display[63][31]).toBe(0); // bottom right
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(00EE)', function() {
      var opcode = 0x00EE;
      var actual = reg0.getOps(opcode);

      it('should get returnFrom function', function() {
        var expected = 'returnFrom';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set program_counter to last stack item and decrement stack pointer', function() {
        var state = {
          program_counter: 0x400,
          stack: [0x200, 0x300],
          stack_pointer: 1
        };

        var expected_pc = 0x300;
        var expected_sp = 0;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
        expect(state.stack_pointer).toEqual(expected_sp);
      });
    });
  });
});
