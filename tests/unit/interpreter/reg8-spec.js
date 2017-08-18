define(["src/scripts/interpreter/reg8"], function(reg8) {
  describe('reg8', function() {
    describe('getOps(8XY0)', function() {
      var opcode = 0x8010;
      var actual = reg8.getOps(opcode);

      it('should get setVxToVy function', function() {
        var expected = 'setVxToVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to value of Vy', function() {
        var state = {
          registers: [0x02, 0xFF],
          program_counter: 0
        };

        var expected_vx = 0xFF;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(8XY1)', function() {
      var opcode = 0x8011;
      var actual = reg8.getOps(opcode);

      it('should get setVxToVxOrVy function', function() {
        var expected = 'setVxToVxOrVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx bitwise OR Vy', function() {
        var state = {
          registers: [0x0, 0x0],
          program_counter: 0
        };

        var expected_vx = 0x0;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);

        expected_vx = 0x1;
        state.registers = [0x0, 0x1];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

        state.registers = [0x1, 0x0];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

        state.registers = [0x1, 0x1];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(8XY2)', function() {
      var opcode = 0x8012;
      var actual = reg8.getOps(opcode);

      it('should get setVxToVxAndVy function', function() {
        var expected = 'setVxToVxAndVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx bitwise And Vy', function() {
        var state = {
          registers: [0x0, 0x0],
          program_counter: 0
        };

        var expected_vx = 0x0;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);

        state.registers = [0x0, 0x1];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

        state.registers = [0x1, 0x0];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

        var expected_vx = 0x1;

        state.registers = [0x1, 0x1];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(8XY3)', function() {
      var opcode = 0x8013;
      var actual = reg8.getOps(opcode);

      it('should get setVxToVxXorVy function', function() {
        var expected = 'setVxToVxXorVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx bitwise XOR Vy', function() {
        var state = {
          registers: [0x0, 0x0],
          program_counter: 0
        };

        var expected_vx = 0x0;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);

        state.registers = [0x1, 0x1];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

        var expected_vx = 0x1;

        state.registers = [0x0, 0x1];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

        state.registers = [0x1, 0x0];
        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(8XY4)', function() {
      var opcode = 0x8014;
      var actual = reg8.getOps(opcode);

      it('should get setVxToVxPlusVy function', function() {
        var expected = 'setVxToVxPlusVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx + Vy', function() {
        var state = {
          registers: [0x2, 0x2],
          program_counter: 0
        };

        var expected_vx = 0x4;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(8XY5)', function() {
      var opcode = 0x8015;
      var actual = reg8.getOps(opcode);

      it('should get setVxToVxMinusVy function', function() {
        var expected = 'setVxToVxMinusVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx - Vy', function() {
        var state = {
          registers: [0x8, 0x2],
          program_counter: 0
        };

        var expected_vx = 0x6;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(8XY6)', function() {
      var opcode = 0x8016;
      var actual = reg8.getOps(opcode);

      it('should get shiftVxRight function', function() {
        var expected = 'shiftVxRight';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('Shift VX right by one. VF set to lsb of VX before the shift.', function() {
        var state = {
          registers: [0xFF, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
          program_counter: 0
        };

        var expected_vx = 0x7F;
        var expected_vf = 0x1;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.registers[0xF]).toBe(expected_vf);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(8XY7)', function() {
      var opcode = 0x8017;
      var actual = reg8.getOps(opcode);

      it('should get setVxEqVyMinusVx function', function() {
        var expected = 'setVxEqVyMinusVx';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vy - Vx and increment program counter by 2', function() {
        var state = {
          registers: [0x01, 0xFF, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
          program_counter: 0
        };
        var expected_vx = 0xFE;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(8X0E)', function() {
      var opcode = 0x800E;
      var actual = reg8.getOps(opcode);

      it('should get shiftVxLeft function', function() {
        var expected = 'shiftVxLeft';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should shift Vx left by one bit and increment program counter + 2', function() {
        var state = {
          registers: [0x0B, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
          program_counter: 0
        };
        var expected_vx = 0x16;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);
      });
    });
  });
});
