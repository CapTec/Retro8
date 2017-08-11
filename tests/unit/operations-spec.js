define(["src/scripts/interpreter/operations"], function(operations) {
  describe('operations', function() {
    describe('getOps(0x02EE) - 0NNN', function() {
      var opcode = 0x02EE;
      var actual = operations.getOps(opcode)

      it('should get callRca if opcode is not 0x00E0 and is not 0x00EE', function() {
        var expected = 'callRca';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('callRca isn\'t documented and isn\'t implemented', function() {
        // 0NNN	Call		Calls RCA 1802 program at address NNN. Not necessary for most ROMs.
      });
    });

    describe('getOps(0x00E0) - 00E0', function() {
      var opcode = 0x00E0;
      var actual = operations.getOps(opcode);

      it('should get clearDisplay function', function() {
        var expected = 'clearDisplay';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should call clearDisplay', function() {
        var expected = {
          clearDisplay: function() {}
        };

        spyOn(expected, 'clearDisplay');

        actual.call(expected, opcode);
        expect(expected.clearDisplay).toHaveBeenCalled();
      });
    });

    describe('getOps(0x00EE) - 00EE', function() {
      var opcode = 0x00EE;
      var actual = operations.getOps(opcode);

      it('should get returnFrom function', function() {
        var expected = 'returnFrom';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set program_counter to last stack item and remove it', function() {
        var state = {
          program_counter: 0x300,
          stack: [0x200, 0x300]
        }

        var expected_pc = 0x200;
        var expected_stack = [0x200];

        actual.call(state, opcode);
        expect(state.program_counter).toBe(expected_pc);
        expect(state.stack).toEqual(expected_stack);
      });
    });

    describe('getOps(0x1FFF) - 1NNN', function() {
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

    describe('getOps(0x2FFF) - 2NNN', function() {
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

    describe('getOps(0x3002) - 3XNN', function() {
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

    describe('getOps(4002) - 4XNN', function() {
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

    describe('getOps(5010) - 5XY0', function() {
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

    describe('getOps(6002) - 6XNN', function() {
      var opcode = 0x6002;
      var actual = operations.getOps(opcode);

      it('should get setVxToNn function', function() {
        var expected = 'setVxToNn';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to value of NN', function() {
        var state = {
          registers: [0x82]
        };
        var expected_vx = 0x02;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(7002) - 7XNN', function() {
      var opcode = 0x7002;
      var actual = operations.getOps(opcode);

      it('should get addNnToVx function', function() {
        var expected = 'addNnToVx';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should add NN to value of Vx', function() {
        var state = {
          registers: [0x02]
        };

        var expected_vx = 0x04;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(8010) - 8XY0', function() {
      var opcode = 0x8010;
      var actual = operations.getOps(opcode);

      it('should get setVxToVy function', function() {
        var expected = 'setVxToVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to value of Vy', function() {
        var state = {
          registers: [0x02, 0xFF]
        };

        var expected_vx = 0xFF;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(8011) - 8XY1', function() {
      var opcode = 0x8011;
      var actual = operations.getOps(opcode);

      it('should get setVxToVxOrVy function', function() {
        var expected = 'setVxToVxOrVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx bitwise OR Vy', function() {
        var state = {
          registers: [0x0, 0x0]
        };

        var expected_vx = 0x0;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

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

    describe('getOps(8012) - 8XY2', function() {
      var opcode = 0x8012;
      var actual = operations.getOps(opcode);

      it('should get setVxToVxAndVy function', function() {
        var expected = 'setVxToVxAndVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx bitwise And Vy', function() {
        var state = {
          registers: [0x0, 0x0]
        };

        var expected_vx = 0x0;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

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

    describe('getOps(8013) - 8XY3', function() {
      var opcode = 0x8013;
      var actual = operations.getOps(opcode);

      it('should get setVxToVxXorVy function', function() {
        var expected = 'setVxToVxXorVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx bitwise XOR Vy', function() {
        var state = {
          registers: [0x0, 0x0]
        };

        var expected_vx = 0x0;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);

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

    describe('getOps(8014) - 8XY4', function() {
      var opcode = 0x8014;
      var actual = operations.getOps(opcode);

      it('should get setVxToVxPlusVy function', function() {
        var expected = 'setVxToVxPlusVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx + Vy', function() {
        var state = {
          registers: [0x2, 0x2]
        };

        var expected_vx = 0x4;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(8015) - 8XY5', function() {
      var opcode = 0x8015;
      var actual = operations.getOps(opcode);

      it('should get setVxToVxMinusVy function', function() {
        var expected = 'setVxToVxMinusVy';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('should set Vx to Vx - Vy', function() {
        var state = {
          registers: [0x8, 0x2]
        };

        var expected_vx = 0x6;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
      });
    });

    describe('getOps(8016) - 8XY6', function() {
      var opcode = 0x8016;
      var actual = operations.getOps(opcode);

      it('should get shiftVxRight function', function() {
        var expected = 'shiftVxRight';

        expect(actual.prototype.constructor.name).toBe(expected);
      });

      it('Shift VX right by one. VF set to lsb of VX before the shift.', function() {
        var state = {
          registers: [0xFF, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]
        };

        var expected_vx = 0x7F;
        var expected_vf = 0x1;

        actual.call(state, opcode);
        expect(state.registers[0]).toBe(expected_vx);
        expect(state.registers[0xF]).toBe(expected_vf);
      });
    });

    it('should get setVxEqVyMinusVx function if opcode is 0x8007', function() {
      var opcode = 0x8007;
      var expected = 'setVxEqVyMinusVx';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get shiftVxLeft function if opcode is 0x800E', function() {
      var opcode = 0x800E;
      var expected = 'shiftVxLeft';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get skipIfVxNotVy if opcode is 0x9000', function() {
      var opcode = 0x9000;
      var expected = 'skipIfVxNotVy';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get setIndexToAddr if opcode is 0xA000', function() {
      var opcode = 0xA000;
      var expected = 'setIndexToAddr';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get jmpToAddrPlsV0 if opcode is 0xB000', function() {
      var opcode = 0xB000;
      var expected = 'jmpToAddrPlsV0';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get bitRandAndV0 if opcode is 0xC000', function() {
      var opcode = 0xC000;
      var expected = 'bitRandAndV0';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get draw if opcode is 0XD000', function() {
      var opcode = 0xD000;
      var expected = 'draw';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get skipIfVxPressed if opcode is 0xE00E', function() {
      var opcode = 0xE00E;
      var expected = 'skipIfVxPressed';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get skipIfVxNotPressed if opcode is 0xE001', function() {
      var opcode = 0xE001;
      var expected = 'skipIfVxNotPressed';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get setVxToDelay if opcode is 0xF007', function() {
      var opcode = 0xF007;
      var expected = 'setVxToDelay';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get setVxToKey if opcode is 0xF00A', function() {
      var opcode = 0xF00A;
      var expected = 'setVxToKey';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get setDelayTimer if opcode is 0xF015', function() {
      var opcode = 0xF015;
      var expected = 'setDelayTimer';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get setSoundTimer if opcode is 0xF018', function() {
      var opcode = 0xF018;
      var expected = 'setSoundTimer';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get addVxToIdxReg if opcode is 0xF01E', function() {
      var opcode = 0xF01E;
      var expected = 'addVxToIdxReg';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get setIdxToSprite if opcode is 0xF029', function() {
      var opcode = 0xF029;
      var expected = 'setIdxToSprite';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get setBcd if opcode is 0xF033', function() {
      var opcode = 0xF033;
      var expected = 'setBcd';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get regDump if opcode is 0xF055', function() {
      var opcode = 0xF055;
      var expected = 'regDump';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });

    it('should get regLoad if opcode is 0xF065', function() {
      var opcode = 0xF065;
      var expected = 'regLoad';
      var actual = operations.getOps(opcode).prototype.constructor.name;

      expect(expected).toBe(actual);
    });
  });
});
