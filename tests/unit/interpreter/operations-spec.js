define(["src/scripts/interpreter/interpreter"], function(Interpreter) {
  var operations = require('src/scripts/interpreter/operations'),
    reg0 = require('src/scripts/interpreter/reg0'),
    CodeNotRecognised = require('src/scripts/interpreter/errors/notrecognised');

  describe('operations', function() {
    describe('getOps(1NNN', function() {
      var opcode = 0x1FFF;
      var actual = operations.getOps(opcode);

      it('should get jump function', function() {
        var expected = 'jump';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set program_counter to nnn', function() {
        var state = {
          program_counter: 0
        };
        var expected = 0xFFF;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected);
      });
    });

    describe('getOps(2NNN)', function() {
      var opcode = 0x2FFF;
      var actual = operations.getOps(opcode);

      it('should get gosub function', function() {
        var expected = 'gosub';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should store current pc in stack and set pc to NNN', function() {
        var state = {
          program_counter: 0xB00,
          stack: new Uint16Array(16),
          stack_pointer: 2
        };

        state.stack[0] = 0x200;
        state.stack[1] = 0x300;
        state.stack[2] = 0xA00;

        var expected_pc = 0xFFF;
        var expected_stack = new Uint16Array(16);//[0x200, 0x300, 0xA00, 0xB00];

        expected_stack[0] = 0x200;
        expected_stack[1] = 0x300;
        expected_stack[2] = 0xA00;
        expected_stack[3] = 0xB00;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
        expect(state.stack).toEqual(expected_stack);
      });
    });

    describe('getOps(3XNN)', function() {
      var opcode = 0x3002;
      var actual = operations.getOps(opcode);

      it('should get skipIfVxEqNN function', function() {
        var expected = 'skipIfVxEqNN';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should increment program_counter by 2 if Vx equals NN', function() {
        var state = {
          program_counter: 0,
          registers: Interpreter.prototype.initRegisters()
        };
        state.registers[0] = 0x2; // vx
        var expected_pc = 2;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
      });

      it('should not increment program_counter  if Vx not equals NN', function() {
        var state = {
          program_counter: 0,
          registers: Interpreter.prototype.initRegisters()
        };
        state.registers[0] = 0x08; // vx
        var expected_pc = 0;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(4XNN)', function() {
      var opcode = 0x4000;
      var actual = operations.getOps(opcode);

      it('should get skipIfVxNotEqNN function', function() {
        var expected = 'skipIfVxNotEqNN';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should increment program_counter by 2 if Vx not equal NN', function() {
        var state = {
          program_counter: 0,
          registers: Interpreter.prototype.initRegisters()
        };
        var expected_pc = 2;
        state.registers[0] = 0x12;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
      });

      it('should not increment program_counter Vx equal NN', function() {
        var state = {
          program_counter: 0,
          registers: Interpreter.prototype.initRegisters()
        };
        state.registers[0] = 0x0;
        var expected_pc = 0;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(5XY0)', function() {
      var opcode = 0x5010;
      var actual = operations.getOps(opcode);

      it('should get skipIfVxEqVy function', function() {
        var expected = 'skipIfVxEqVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should increment program_counter by 2 if Vx eq Vy', function() {
        var state = {
          program_counter: 0,
          registers: Interpreter.prototype.initRegisters()
        };
        state.registers[0] = 0x12;
        state.registers[1] = 0x12;
        var expected_pc = 2;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
      });

      it('should not increment program_counterif Vx not eq Vy', function() {
        var state = {
          program_counter: 0,
          registers: Interpreter.prototype.initRegisters()
        };
        state.registers[0] = 0x12;
        state.registers[1] = 0x16;
        var expected_pc = 0;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(6XNN)', function() {
      var opcode = 0x6002;
      var actual = operations.getOps(opcode);

      it('should get setVxToNn function', function() {
        var expected = 'setVxToNn';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to value of NN', function() {
        var state = {
          registers: Interpreter.prototype.initRegisters()
        };
        state.registers[0] = 0x82;
        var expected_vx = 0x02;

        actual.call(undefined, opcode, state);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(7XNN)', function() {
      var opcode = 0x7002;
      var actual = operations.getOps(opcode);

      it('should get addNnToVx function', function() {
        var expected = 'addNnToVx';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should add NN to value of Vx', function() {
        var state = {
          registers: Interpreter.prototype.initRegisters()
        };
        state.registers[0] = 0x02;

        var expected_vx = 0x04;

        actual.call(undefined, opcode, state);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(9XY0)', function() {
      var opcode = 0x9010;
      var actual = operations.getOps(opcode);

      it('should get skipIfVxNotVy function', function() {
        var expected = 'skipIfVxNotVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should increment program_counter + 2 if Vx != Vy', function() {
        var state = {
          registers: Interpreter.prototype.initRegisters(),
          program_counter: 0
        };
        state.registers[0] = 0x0b;
        state.registers[1] = 0x0;

        var expected_pc = 2;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
      });

      it('should not increment program_counter if Vx == Vy', function() {
        var state = {
          registers: Interpreter.prototype.initRegisters(),
          program_counter: 0
        };
        state.registers[0] = 0x0B;
        state.registers[1] = 0x0B;

        var expected_pc = 0;

        actual.call(undefined, opcode, state);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(ANNN)', function() {
      var opcode = 0xA100;
      var actual = operations.getOps(opcode);

      it('should get setIndexToAddr function', function() {
        var expected = 'setIndexToAddr';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set index_register to nnn', function() {
        var state = {
          index_register: 0x0
        };

        var expected_ir = 0x100;

        actual.call(undefined, opcode, state);
        expect(state.index_register).toBe(expected_ir);
      });
    });

    describe('getOps(BNNN)', function() {
      var opcode = 0xB100;
      var actual = operations.getOps(opcode);

      it('should get jmpToAddrPlsV0 function', function() {
        var expected = 'jmpToAddrPlsV0';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set program_counter to nnn + Vx', function() {
        var state = {
          program_counter: 0,
          registers: Interpreter.prototype.initRegisters()
        };
        state.registers[0] = 0xA;
        var expected_pc = 0x10A;

        actual.call(undefined, opcode, state);

        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(CXNN)', function() {
      var opcode = 0xC010;
      var actual = operations.getOps(opcode);

      it('should set bitSetVxRandAndV0 function', function() {
        var expected = 'bitSetVxRandAndV0';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to 0 if rand generates different value to NN', function() {
        var state = {
            registers: Interpreter.prototype.initRegisters()
          },
          expected_vx = 0;
        state.registers[0] = 0xAB;
        Math.random = sinon.stub().returns(0.04);

        actual.call(undefined, opcode, state);

        expect(state.registers[0]).toBe(expected_vx);
        Math.random.reset();
      });
    });

    describe('getOps(DXYN)', function() {
      var opcode = 0xD011;
      var actual = operations.getOps(opcode);

      it('should get draw function', function() {
        var expected = 'draw';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should draw 8x1 sprite and set VF to 0', function() {
        var state = {
            display: Interpreter.prototype.initDisplay(64, 32),
            registers: Interpreter.prototype.initRegisters(),
            memory: Interpreter.prototype.initMemory(),
            index_register: 0x200
          },
          expected_off_pixel = 0x0,
          expected_on_pixel = 0x1,
          expected_vf = 0,
          expected_sprite = 0x18; // 00011000
        state.registers[0] = 0x1B; // x coord: 27
        state.registers[1] = 0x0; // y coord: 0
        state.memory[0x200] = expected_sprite;

        actual.call(undefined, opcode, state);

        expect(state.display[29][0]).toBe(expected_off_pixel);
        expect(state.display[30][0]).toBe(expected_on_pixel);
        expect(state.display[31][0]).toBe(expected_on_pixel);
        expect(state.display[32][0]).toBe(expected_off_pixel);

        expect(state.registers[0xF]).toBe(expected_vf);
      });

      it('should draw 8x1 sprite, set pc to 2 and VF to 1', function() {
        var state = {
            display: Interpreter.prototype.initDisplay(64, 32),
            registers: Interpreter.prototype.initRegisters(), // display at x:27, y:0
            memory: Interpreter.prototype.initMemory(),
            index_register: 0x200
          },
          expected_off_pixel = 0x0,
          expected_on_pixel = 0x1,
          expected_vf = 0x1,
          expected_sprite = 0x18; // 00011000
        state.memory[0x200] = expected_sprite;
        state.display[30][0] = 0x1;
        state.display[31][0] = 0x1;
        state.registers[0] = 0x1B;
        state.registers[1] = 0x0;

        actual.call(undefined, opcode, state);

        expect(state.display[29][0]).toBe(expected_off_pixel);
        expect(state.display[30][0]).toBe(expected_off_pixel);
        expect(state.display[31][0]).toBe(expected_off_pixel);
        expect(state.display[32][0]).toBe(expected_off_pixel);

        expect(state.registers[0xF]).toBe(expected_vf);
      });
    });

    describe('getOps(undefined)', function() {
      var opcode = 'undefined';

      it('should throw CodeNotRecognised error', function() {
        function actual() {
          return operations.getOps(opcode);
        }

        expect(actual).toThrowError(CodeNotRecognised);
      });
    });

    describe('getOps(0x0000)', function() {
      var opcode = 0x0000;

      it('should get callRca', function() {
        var actual = operations.getOps(opcode);
        expect(actual.prototype.constructor.name).toBe('callRca');
      });
    });

    describe('getOps(0x8008)', function() {
      var opcode = 0x8008; // unrecognised 8 code

      it('should throw CodeNotRecognised', function() {
        var actual = function() {
          return operations.getOps(opcode);
        };

        expect(actual).toThrowError(CodeNotRecognised);
      });
    });

    describe('getOps(0xE0BB)', function() {
      var opcode = 0xE0BB; // unrecognised E code

      it('should throw CodeNotRecognised', function() {
        var actual = function() {
          return operations.getOps(opcode);
        };

        expect(actual).toThrowError(CodeNotRecognised);
      });
    });

    describe('getOps(0xF0BB)', function() {
      var opcode = 0xF0BB; // unrecognised F code

      it('should throw CodeNotRecognised', function() {
        var actual = function() {
          return operations.getOps(opcode);
        };

        expect(actual).toThrowError(CodeNotRecognised);
      });
    });
  });
});
