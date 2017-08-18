define(["src/scripts/interpreter/operations", "src/scripts/interpreter/interpreter"], function(operations, Interpreter) {
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

        actual.call(state, opcode);
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
          stack: [0x200, 0x300, 0xA00]
        };

        var expected_pc = 0xFFF;
        var expected_stack = [0x200, 0x300, 0xA00, 0xB00];

        actual.call(state, opcode);
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

      it('should increment program_counter by 4 if Vx equals NN', function() {
        var state = {
          program_counter: 0,
          registers: [0x02]
        };
        var expected_pc = 4;

        actual.call(state, opcode);
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

      it('should increment program_counter by 4 if Vx not equal NN', function() {
        var state = {
          program_counter: 0,
          registers: [0x12]
        };
        var expected_pc = 4;

        actual.call(state, opcode);
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

      it('should increment program_counter by 4 if Vx eq Vy', function() {
        var state = {
          program_counter: 0,
          registers: [0x12, 0x12]
        };
        var expected_pc = 4;

        actual.call(state, opcode);
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
          registers: [0x82],
          program_counter: 0
        };
        var expected_vx = 0x02;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);
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
          registers: [0x02],
          program_counter: 0
        };

        var expected_vx = 0x04;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(9XY0)', function() {
      var opcode = 0x9010;
      var actual = operations.getOps(opcode)

      it('should get skipIfVxNotVy function', function() {
        var expected = 'skipIfVxNotVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should increment program_counter + 4 if Vx != Vy', function() {
        var state = {
          registers: [0x0B, 0x0],
          program_counter: 0
        };

        var expected_pc = 4;

        actual.call(state, opcode);
        expect(state.program_counter).toBe(expected_pc);
      });

      it('should increment program_counter + 2 if Vx == Vy', function() {
        var state = {
          registers: [0x0B, 0x0B],
          program_counter: 0
        };

        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(ANNN)', function() {
      var opcode = 0xA100;
      var actual = operations.getOps(opcode)

      it('should get setIndexToAddr function', function() {
        var expected = 'setIndexToAddr';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set index_register to nnn and increment program_counter + 2', function() {
        var state = {
          index_register: 0x0,
          program_counter: 0
        };

        var expected_ir = 0x100;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.index_register).toBe(expected_ir);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(BNNN)', function() {
      var opcode = 0xB100;
      var actual = operations.getOps(opcode)

      it('should get jmpToAddrPlsV0 function', function() {
        var expected = 'jmpToAddrPlsV0';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set program_counter to nnn + Vx', function() {
        var state = {
          program_counter: 0,
          registers: [0xA]
        };
        var expected_pc = 0x10A;

        actual.call(state, opcode);

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

      it('should set Vx to 0 if rand generates different value to NN and increment program_counter', function() {
        var state = {
            program_counter: 0,
            registers: [0xAB]
          },
          expected_pc = 2,
          expected_vx = 0;
        Math.random = sinon.stub().returns(0.04);

        actual.call(state, opcode);

        expect(state.program_counter).toBe(expected_pc);
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

      it('should draw 8x1 sprite, set pc to 2 and VF to 0', function() {
        var state = {
            display: Interpreter.prototype.display,
            registers: [0x1B, 0x0], // display at x:27, y:0
            program_counter: 0,
            memory: Interpreter.prototype.memory,
            index_register: 0x200
          },
          expected_off_pixel = 0x0,
          expected_on_pixel = 0x1,
          expected_pc = 2,
          expected_vf = 0,
          expected_sprite = 0x18; // 00011000
        state.memory[0x200] = expected_sprite;

        actual.call(state, opcode);

        expect(state.display[29][0]).toBe(expected_off_pixel);
        expect(state.display[30][0]).toBe(expected_on_pixel);
        expect(state.display[31][0]).toBe(expected_on_pixel);
        expect(state.display[32][0]).toBe(expected_off_pixel);

        expect(state.program_counter).toBe(expected_pc);
        expect(state.registers[0xF]).toBe(expected_vf);
      });

      it('should draw 8x1 sprite, set pc to 2 and VF to 1', function() {
        var state = {
            display: Interpreter.prototype.display,
            registers: [0x1B, 0x0], // display at x:27, y:0
            program_counter: 0,
            memory: Interpreter.prototype.memory,
            index_register: 0x200
          },
          expected_off_pixel = 0x0,
          expected_on_pixel = 0x1,
          expected_pc = 2,
          expected_vf = 0x1,
          expected_sprite = 0x18; // 00011000
        state.memory[0x200] = expected_sprite;
        state.display[30][0] = 0x1;
        state.display[31][0] = 0x1;

        actual.call(state, opcode);

        expect(state.display[29][0]).toBe(expected_off_pixel);
        expect(state.display[30][0]).toBe(expected_off_pixel);
        expect(state.display[31][0]).toBe(expected_off_pixel);
        expect(state.display[32][0]).toBe(expected_off_pixel);

        expect(state.program_counter).toBe(expected_pc);
        expect(state.registers[0xF]).toBe(expected_vf);
      });
    });
  });
});