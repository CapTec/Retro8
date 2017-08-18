define(["src/scripts/interpreter/regf", "src/scripts/interpreter/interpreter"], function(regf, Interpreter) {
  describe('regf', function() {
    describe('getOps(FX07)', function() {
      var opcode = 0xF007;
      var actual = regf.getOps(opcode)

      it('should get setVxToDelay function', function() {
        var expected = 'setVxToDelay';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('sets Vx to value of delay timer', function() {
        var state = {
          program_counter: 0,
          registers: [0xFF],
          delayTimer: 0xA
        };

        var expected_vx = 0xA;
        var expected_pc = 2;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(FX0A)', function() {
      var opcode = 0xF00A;
      var actual = regf.getOps(opcode);

      it('should get setVxToKey function', function() {
        var expected = 'setVxToKey';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to current pressed key (blocking) and increment pc', function() {
        var state = {
          registers: [0x0],
          keyboard: {
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
            0xA: 1,
            0x0: 0,
            0xB: 0,
            0xF: 0
          },
          program_counter: 0
        };

        var expected_pc = 2;
        var expected_vx = 0xA;

        actual.call(state, opcode);

        expect(state.program_counter).toBe(expected_pc);
        expect(state.registers[0]).toEqual(expected_vx);
      });

      it('should block if no key pressed, pc should remain unchanged', function() {
        var state = {
          registers: [0xA],
          keyboard: Interpreter.prototype.keyboard,
          program_counter: 0
        };

        var expected_pc = 0;

        actual.call(state, opcode);

        expect(state.program_counter).toBe(expected_pc);
      });
    });

    describe('getOps(FX15)', function() {
      var opcode = 0xF015;
      var actual = regf.getOps(opcode)

      it('should get setDelayTimer function', function() {
        var expected = 'setDelayTimer';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set delay timer to value of Vx', function() {
        var state = {
            registers: [0xA],
            program_counter: 0,
            delayTimer: 0
          },
          expected_dt = 0xA,
          expected_pc = 2;

        actual.call(state, opcode);

        expect(state.delayTimer).toEqual(expected_dt);
        expect(state.program_counter).toEqual(expected_pc);
      });
    });

    describe('getOps(FX18)', function() {
      var opcode = 0xF018;
      var actual = regf.getOps(opcode)

      it('should get setSoundTimer function', function() {
        var expected = 'setSoundTimer';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set soundTimer to value of Vx', function() {
        var state = {
            registers: [0xA],
            program_counter: 0,
            soundTimer: 0
          },
          expected_st = 0xA,
          expected_pc = 2;

        actual.call(state, opcode);

        expect(state.soundTimer).toEqual(expected_st);
        expect(state.program_counter).toEqual(expected_pc);
      });
    });

    describe('getOps(FX1E)', function() {
      var opcode = 0xF01E;
      var actual = regf.getOps(opcode)

      it('should get addVxToIdxReg function', function() {
        var expected = 'addVxToIdxReg';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should add Vx to index register', function() {
        var state = {
            registers: [0x1],
            index_register: 0x1,
            program_counter: 0
          },
          expected_i = 0x2,
          expected_pc = 2;

        actual.call(state, opcode);

        expect(state.index_register).toBe(expected_i);
      });
    });

    describe('getOps(FX29)', function() {
      var opcode = 0xF029;
      var actual = regf.getOps(opcode);

      it('should get setIdxToSprite function', function() {
        var expected = 'setIdxToSprite';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set index register to location of sprite (Vx * 5)', function() {
        var state = {
          registers: [0x2],
          index_register: 0,
          program_counter: 0
        };

        actual.call(state, opcode);

        expect(state.index_register).toBe(0xA);
      });
    });

    describe('getOps(FX33)', function() {
      var opcode = 0xF033;
      var actual = regf.getOps(opcode);

      it('should get setBcd if opcode is 0xFX33', function() {
        var expected = 'setBcd';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('stores bcd of Vx at mem addresses I (hundreds), I+1 (tens), and I+2(units)', function() {
        var state = {
            registers: [0x3BB],
            memory: new Uint8Array(4096),
            program_counter: 0,
            index_register: 0
          },
          expected_hundred = 0x9,
          expected_ten = 0x5,
          expected_unit = 0x5;

        actual.call(state, opcode)

        expect(state.memory[0]).toEqual(expected_hundred);
        expect(state.memory[1]).toEqual(expected_ten);
        expect(state.memory[2]).toEqual(expected_unit);
      });
    });

    describe('getOps(FX55)', function() {
      var opcode = 0xF255;
      var actual = regf.getOps(opcode)

      it('should get regDump function', function() {
        var expected = 'regDump';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('dumps registers V0 through to Vx to memory starting at index_register', function() {
        var state = {
            registers: [0x1, 0x2, 0x3],
            memory: Interpreter.prototype.memory,
            index_register: 0x200,
            program_counter: 0
          },
          expected_pc = 2,
          expected_mem0 = 0x1,
          expected_mem0_addr = 0x200,
          expected_mem1 = 0x2,
          expected_mem1_addr = 0x201,
          expected_mem2 = 0x3,
          expected_mem2_addr = 0x202;

        actual.call(state, opcode);

        expect(state.program_counter).toBe(expected_pc);
        expect(state.memory[expected_mem0_addr]).toBe(expected_mem0);
        expect(state.memory[expected_mem1_addr]).toBe(expected_mem1);
        expect(state.memory[expected_mem2_addr]).toBe(expected_mem2);
      });
    });

    describe('getOps(FX65)', function() {
      var opcode = 0xF265;
      var actual = regf.getOps(opcode);

      it('should get regLoad function', function() {
        var expected = 'regLoad';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set V0 - Vx with values from memory starting at index_register address', function() {
        var state = {
          registers: [0x0, 0x0, 0x0],
          memory: Interpreter.prototype.memory,
          index_register: 0x200,
          program_counter: 0
        };
        state.memory[0x200] = 0x1,
        state.memory[0x201] = 0x2,
        state.memory[0x202] = 0x3,
        expected_v0 = 0x1,
        expected_v1 = 0x2,
        expected_v2 = 0x3,
        expected_pc = 2;

        actual.call(state, opcode);

        expect(state.program_counter).toBe(expected_pc);
        expect(state.registers[0]).toBe(expected_v0);
        expect(state.registers[1]).toBe(expected_v1);
        expect(state.registers[2]).toBe(expected_v2);
      });
    });
  });
});
