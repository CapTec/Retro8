define(['./reg0', './reg8', './rege', './regf', './errors/notimplemented', './errors/notrecognised'], function(reg0, reg8, regE, regF, CodeNotImplemented, CodeNotRecognised) {
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

  function getOps(opcode) {
    var op = null;

    if (operations[(opcode & 0xF000)] === reg0.getOps) {
      op = reg0.getOps(opcode);
    } else if (operations[(opcode & 0xF000)] === reg8.getOps) {
      op = reg8.getOps(opcode);
    } else if (operations[(opcode & 0xF000)] === regE.getOps) {
      op = regE.getOps(opcode);
    } else if (operations[(opcode & 0xF000)] === regF.getOps) {
      op = regF.getOps(opcode);
    } else {
      op = operations[(opcode & 0xF000)];
    }

    if (typeof op === 'undefined')
      throw new CodeNotRecognised(opcode);

    return op;
  }

  /*
   * Jumps to address NNN.
   * pseudo: goto NNN
   * operator type: Flow
   * opcode: 1NNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function jump(opcode) {
    var nnn = opcode & 0x0FFF;

    this.program_counter = nnn;
  }

  /*
   * Calls subroutine at NNN.
   * pseudo: *(0xNNN)()
   * operator type: Flow
   * opcode: 2NNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function gosub(opcode) {
    var nnn = opcode & 0x0FFF;

    this.stack_pointer += 1;
    this.stack.push(this.program_counter);
    this.program_counter = nnn;
  }

  /*
   * Skips the next instruction if VX equals NN.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(Vx == NN)
   * operator type: conditional
   * opcode: 3XNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function skipIfVxEqNN(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      nn = opcode & 0x00FF;

    if (this.registers[vx] === nn)
      this.program_counter += 4;
  }

  /*
   * Skips the next instruction if VX doesn't equal NN.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(Vx != NN)
   * operator type: conditional
   * opcode: 4XNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function skipIfVxNotEqNN(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      nn = opcode & 0x00FF;

    if (this.registers[vx] !== nn)
      this.program_counter += 4;
  }

  /*
   * Skips the next instruction if VX equals VY.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(Vx == Vy)
   * operator type: conditional
   * opcode: 5XY0
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function skipIfVxEqVy(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    if (this.registers[vx] === this.registers[vy])
      this.program_counter += 4;
  }

  /*
   * Sets VX to NN.
   * psuedo: Vx = NN
   * operator type: constant
   * opcode: 6XNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToNn(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      nn = opcode & 0x00FF;

    this.registers[vx] = nn;
    this.program_counter += 2;
  }

  /*
   * Adds NN to Vx.
   * psuedo: Vx += NN
   * operator type: constant
   * opcode: 7XNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function addNnToVx(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      nn = opcode & 0x00FF;

    this.registers[vx] += nn;
    this.program_counter += 2;
  }

  /*
   * Skips the next instruction if VX doesn't equal VY.
   * (Usually the next instruction is a jump to skip a code block).
   * psuedo: if(Vx!=Vy)
   * operator type: conditional
   * opcode: 9XY0
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function skipIfVxNotVy(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

      this.program_counter += 2;

      if(this.registers[vx] !== this.registers[vy]) {
        this.program_counter += 2;
      }
  }

  /*
   * Sets I to the address NNN.
   * psuedo: i = NNN
   * operator type: Memory
   * opcode: ANNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setIndexToAddr(opcode) {
    var nnn = opcode & 0x0FFF;
    
    this.index_register = nnn;
    this.program_counter += 2;
  }

  /*
   * Jumps to the address NNN plus V0.
   * psuedo: PC=V0+NNN
   * operator type: Flow
   * opcode: BXNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function jmpToAddrPlsV0(opcode) {
    throw new CodeNotImplemented(opcode);
  }

  /*
   * Sets VX to the result of a bitwise and operation on a random number
   * (Typically: 0 to 255) and NN.
   * psuedo: 	Vx=rand()&NN
   * operator type: Rand
   * opcode: CXNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function bitSetVxRandAndV0(opcode) {
    throw new CodeNotImplemented(opcode);
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
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function draw(opcode) {
    var vx = (opcode & 0x0F00) >> 8;
    var vy = (opcode & 0x00F0) >> 4;
    var height = (opcode & 0x000F);

    var coordx = this.registers[vx];
    var coordy = this.registers[vy];

    this.registers[0xF] = 0x0;

    for(var y = 0; y < height; y++) {
      var sprite_byte = this.memory[this.index_register + y];

      for(var x = 0; x < 8; x++) {
        var bit = sprite_byte & (0x80 >> x);

        if(bit !== 0x0) {
          if(this.display[coordx + x][coordy + y] === 0x1) {
            this.registers[0xF] = 1;
          }

          this.display[coordx + x][coordy + y] ^= 0x1;
        }
      }
    }

    this.program_counter += 2;
  }

  return {
    getOps: getOps
  };
});
