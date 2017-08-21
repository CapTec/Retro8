define(['./reg0', './reg8', './rege', './regf', './errors/notrecognised'], function(reg0, reg8, regE, regF, CodeNotRecognised) {
  'use strict';

  var operations = {
    0x0000: reg0.getOps,
    0x1000: jump,
    0x2000: gosub,
    0x3000: skipIfVxEqNN,
    0x4000: skipIfVxNotEqNN,
    0x5000: skipIfVxEqVy,
    0x6000: setVxToNn,
    0x7000: addNnToVx,
    0x8000: reg8.getOps,
    0x9000: skipIfVxNotVy,
    0xA000: setIndexToAddr,
    0xB000: jmpToAddrPlsV0,
    0xC000: bitSetVxRandAndV0,
    0XD000: draw,
    0xE000: regE.getOps,
    0xF000: regF.getOps
  };

  function getOps(opcode, self) {
    var op = null;

    if (typeof opcode !== 'number') {
      throw new CodeNotRecognised(opcode);
    } else if (operations[(opcode & 0xF000)] === reg0.getOps) {
      op = reg0.getOps(opcode, self);
    } else if (operations[(opcode & 0xF000)] === reg8.getOps) {
      op = reg8.getOps(opcode, self);
    } else if (operations[(opcode & 0xF000)] === regE.getOps) {
      op = regE.getOps(opcode, self);
    } else if (operations[(opcode & 0xF000)] === regF.getOps) {
      op = regF.getOps(opcode, self);
    } else {
      op = operations[(opcode & 0xF000)];
    }

    if (typeof op === 'undefined') {
      throw new CodeNotRecognised(opcode);
    }

    return op;
  }

  /*
   * Jumps to address NNN.
   * pseudo: goto NNN
   * operator type: Flow
   * opcode: 1NNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function jump(opcode, self) {
    var nnn = opcode & 0x0FFF;

    self.program_counter = nnn;
  }

  /*
   * Calls subroutine at NNN.
   * pseudo: *(0xNNN)()
   * operator type: Flow
   * opcode: 2NNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function gosub(opcode, self) {
    var nnn = opcode & 0x0FFF;

    self.stack_pointer += 1;
    self.stack.push(self.program_counter);
    self.program_counter = nnn;
  }

  /*
   * Skips the next instruction if VX equals NN.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(Vx == NN)
   * operator type: conditional
   * opcode: 3XNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function skipIfVxEqNN(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      nn = opcode & 0x00FF;

    if (self.registers[vx] === nn) {
      self.program_counter += 2;
    }
    self.program_counter += 2;
  }

  /*
   * Skips the next instruction if VX doesn't equal NN.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(Vx != NN)
   * operator type: conditional
   * opcode: 4XNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function skipIfVxNotEqNN(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      nn = opcode & 0x00FF;

    if (self.registers[vx] !== nn) {
      self.program_counter += 2;
    }
    self.program_counter += 2;
  }

  /*
   * Skips the next instruction if VX equals VY.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(Vx == Vy)
   * operator type: conditional
   * opcode: 5XY0
   * @param {UInt16} opcode - 16 bit operand word
   */
  function skipIfVxEqVy(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    if (self.registers[vx] === self.registers[vy]) {
      self.program_counter += 2;
    }
    self.program_counter += 2;
  }

  /*
   * Sets VX to NN.
   * psuedo: Vx = NN
   * operator type: constant
   * opcode: 6XNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setVxToNn(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      nn = opcode & 0x00FF;

    self.registers[vx] = nn;
    self.program_counter += 2;
  }

  /*
   * Adds NN to Vx.
   * psuedo: Vx += NN
   * operator type: constant
   * opcode: 7XNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function addNnToVx(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      nn = opcode & 0x00FF;

    self.registers[vx] += nn;
    self.program_counter += 2;
  }

  /*
   * Skips the next instruction if VX doesn't equal VY.
   * (Usually the next instruction is a jump to skip a code block).
   * psuedo: if(Vx!=Vy)
   * operator type: conditional
   * opcode: 9XY0
   * @param {UInt16} opcode - 16 bit operand word
   */
  function skipIfVxNotVy(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    self.program_counter += 2;

    if (self.registers[vx] !== self.registers[vy]) {
      self.program_counter += 2;
    }
  }

  /*
   * Sets I to the address NNN.
   * psuedo: i = NNN
   * operator type: Memory
   * opcode: ANNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setIndexToAddr(opcode, self) {
    var nnn = opcode & 0x0FFF;

    self.index_register = nnn;
    self.program_counter += 2;
  }

  /*
   * Jumps to the address NNN plus V0.
   * psuedo: PC=V0+NNN
   * operator type: Flow
   * opcode: BNNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function jmpToAddrPlsV0(opcode, self) {
    var v0 = self.registers[0];
    var nnn = (opcode & 0x0FFF);

    self.program_counter = nnn + v0;
  }

  /*
   * Sets VX to the result of a bitwise and operation on a random number
   * (Typically: 0 to 255) and NN.
   * psuedo: 	Vx=rand()&NN
   * operator type: Rand
   * opcode: CXNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function bitSetVxRandAndV0(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8;
    var nn = (opcode & 0x00FF);

    self.registers[vx] = Math.floor(Math.random() * 256) & nn;
    self.program_counter += 2;
  }

  /*
   * Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels.
   * Each row of 8 pixels is read as bit-coded starting from memory location I;
   * I value doesn’t change after the execution of this instruction.
   * As described above, VF is set to 1 if any screen pixels are flipped from set to unset
   * when the sprite is drawn, and to 0 if that doesn’t happen
   * psuedo: 	draw(Vx,Vy,N)
   * operator type: Display
   * opcode: DXYN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function draw(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8;
    var vy = (opcode & 0x00F0) >> 4;
    var height = (opcode & 0x000F);

    var coordx = self.registers[vx];
    var coordy = self.registers[vy];

    self.registers[0xF] = 0x0;

    for (var y = 0; y < height; y++) {
      var sprite_byte = self.memory[self.index_register + y];

      for (var x = 0; x < 8; x++) {
        var bit = sprite_byte & (0x80 >> x);

        if (bit !== 0x0) {
          if (self.display[coordx + x][coordy + y] === 0x1) {
            self.registers[0xF] = 1;
          }

          self.display[coordx + x][coordy + y] ^= 0x1;
        }
      }
    }

    self.program_counter += 2;
  }

  return {
    getOps: getOps
  };
});
