define(function() {
  'use strict';

  var operations = {
    0x0000: setVxToVy,
    0x0001: setVxToVxOrVy,
    0x0002: setVxToVxAndVy,
    0x0003: setVxToVxXorVy,
    0x0004: setVxToVxPlusVy,
    0x0005: setVxToVxMinusVy,
    0x0006: shiftVxRight,
    0x0007: setVxEqVyMinusVx,
    0x000E: shiftVxLeft
  };

  function getOps(opcode, self) {
    return operations[(opcode & 0x000F)];
  }

  /*
   * Sets VX to the value of VY.
   * psuedo: Vx = Vy
   * operator type: assignment
   * opcode: 0x8XY0
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setVxToVy(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    self.registers[vx] = self.registers[vy];
  }

  /*
   * Sets VX to VX or VY. (Bitwise OR operation).
   * psuedo: Vx = Vx | Vy
   * operator type: bitwise operator
   * opcode: 8XY1
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setVxToVxOrVy(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    self.registers[vx] |= self.registers[vy];
  }

  /*
   * Sets VX to VX & VY. (Bitwise AND operation).
   * psuedo: Vx = Vx & Vy
   * operator type: bitwise operator
   * opcode: 8XY2
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setVxToVxAndVy(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    self.registers[vx] &= self.registers[vy];
  }

  /*
   * Sets VX to VX xor VY. (Bitwise XOR operation)
   * psuedo: Vx = Vx ^ Vy
   * operator type: bitwise operator
   * opcode: 8XY3
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setVxToVxXorVy(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    self.registers[vx] ^= self.registers[vy];
  }

  /*
   * The values of Vx and Vy are added together.
   * If the result is greater than 8 bits (i.e., > 255,)
   * VF is set to 1, otherwise 0. Only the lowest 8 bits of the result are kept, and stored in Vx.
   * psuedo: Vx = Vx += Vy
   * operator type: Math
   * opcode: 8XY4
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setVxToVxPlusVy(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    if(self.registers[vx] + self.registers[vy] > 0xFF) {
      self.registers[0xF] = 1;
    } else {
      self.registers[0xF] = 0;
    }

    self.registers[vx] += self.registers[vy];
  }

  /*
   * If Vx > Vy, then VF is set to 1, otherwise 0. Then Vy is subtracted from Vx, and the results stored in Vx.
   * psuedo: Vx = Vx -= Vy
   * operator type: Math
   * opcode: 8XY5
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setVxToVxMinusVy(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

      if(self.registers[vx] > self.registers[vy]) {
        self.registers[0xF] = 1;
      } else {
        self.registers[0xF] = 0;
      }

      self.registers[vx] -= self.registers[vy];
  }

  /*
   * If the least-significant bit of Vx is 1, then VF is set to 1, otherwise 0. Then Vx is divided by 2.
   * psuedo: Vx >> 1
   * operator type: Bitwise operator
   * opcode: 8XY6
   * @param {UInt16} opcode - 16 bit operand word
   */
  function shiftVxRight(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8;
    var lsb = self.registers[vx] & 0x01;

    self.registers[0xF] = lsb;
    self.registers[vx] >>= 1;
  }

  /*
   * If Vy > Vx, then VF is set to 1, otherwise 0. Then Vx is subtracted from Vy, and the results stored in Vx.
   * psuedo: Vx = Vy-Vx
   * operator type: Math
   * opcode: 8XY7
   * @param {UInt16} opcode - 16 bit operand word
   */
  function setVxEqVyMinusVx(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    if (self.registers[vy] > self.registers[vx]) {
      self.registers[0xF] = 1;
    } else {
      self.registers[0xF] = 0;
    }

    self.registers[vx] = self.registers[vy] - self.registers[vx];
  }

  /*
   * If the most-significant bit of Vx is 1, then VF is set to 1, otherwise to 0. Then Vx is multiplied by 2.
   * psuedo: Vx << 1
   * operator type: Math
   * opcode: 8XYE
   * @param {UInt16} opcode - 16 bit operand word
   */
  function shiftVxLeft(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8;
    var msb = self.registers[vx] & 0x80;

    self.registers[0xF] = msb;
    self.registers[vx] <<= 1;
  }

  return {
    getOps: getOps
  };
});
