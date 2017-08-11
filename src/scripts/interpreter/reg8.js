define(function() {
  'use strict';

  function getOps(opcode) {
    var vops = {
      0x0000: setVxToVy,
      0x0001: setVxToVxOrVy,
      0x0002: setVxToVxAndVy,
      0x0003: setVxToVxXorVy,
      0x0004: setVxToVxPlusVy,
      0x0005: setVxToVxMinusVy,
      0x0006: shiftVxRight,
      0x0007: setVxEqVyMinusVx,
      0x000E: shiftVxLeft
    }
    return vops[(opcode & 0x000F)];
  }

  /*
   * Sets VX to the value of VY.
   * psuedo: Vx = Vy
   * operator type: assignment
   * opcode: 0x8XY0
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToVy(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    this.registers[vx] = this.registers[vy]
    this.program_counter += 2;
  }

  /*
   * Sets VX to VX or VY. (Bitwise OR operation).
   * psuedo: Vx = Vx | Vy
   * operator type: bitwise operator
   * opcode: 8XY1
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToVxOrVy(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    this.registers[vx] = this.registers[vx] | this.registers[vy];
    this.program_counter += 2;
  }

  /*
   * Sets VX to VX & VY. (Bitwise AND operation).
   * psuedo: Vx = Vx & Vy
   * operator type: bitwise operator
   * opcode: 8XY2
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToVxAndVy(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    this.registers[vx] = this.registers[vx] & this.registers[vy];
    this.program_counter += 2;
  }

  /*
   * Sets VX to VX xor VY. (Bitwise XOR operation)
   * psuedo: Vx = Vx ^ Vy
   * operator type: bitwise operator
   * opcode: 8XY3
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToVxXorVy(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    this.registers[vx] = this.registers[vx] ^ this.registers[vy];
    this.program_counter += 2;
  }

  /*
   * Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
   * psuedo: Vx = Vx += Vy
   * operator type: Math
   * opcode: 8XY4
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToVxPlusVy(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    var sum = this.registers[vx] + this.registers[vy];
    if (sum > 0xFF) {
      this.registers[0xF] = 1;
    } else {
      this.registers[0xF] = 0;
    }

    this.registers[vx] = sum;
    this.program_counter += 2;
  }

  /*
   * VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
   * psuedo: Vx = Vx -= Vy
   * operator type: Math
   * opcode: 8XY5
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToVxMinusVy(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    if (this.registers[vx] > this.registers[vy]) {
      this.registers[0xF] = 1;
    } else {
      this.registers[0xF] = 0;
    }

    this.registers[vx] -= this.registers[vy];
    this.program_counter += 2;
  }

  /*
   * Shifts VX right by one. VF is set to the value of the least significant bit of VX before the shift.
   * psuedo: Vx >> 1
   * operator type: Bitwise operator
   * opcode: 8XY6
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function shiftVxRight(opcode) {
    var vx = (opcode & 0x0F00) >> 8;
    var lsb = this.registers[vx] & 0x01;

    this.registers[0xF] = lsb;
    this.registers[vx] = this.registers[vx] >> 1;
    this.program_counter += 2;
  }

  /*
   * Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
   * psuedo: Vx = Vy-Vx
   * operator type: Math
   * opcode: 8XY7
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxEqVyMinusVx(opcode) {
    var vx = (opcode & 0x0F00) >> 8,
      vy = (opcode & 0x00F0) >> 4;

    if (this.registers[vx] > this.registers[vy]) {
      this.registers[0xF] = 0;
    } else {
      this.registers[0xF] = 1;
    }

    this.registers[vx] = this.registers[vy] - this.registers[vx];
    this.program_counter += 2;
  }

  /*
   * Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift.
   * psuedo: Vx << 1
   * operator type: Math
   * opcode: 8XYE
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function shiftVxLeft(opcode) {
    var vx = (opcode & 0x0F00) >> 8;
    var msb = this.registers[vx] & 0x80;

    this.registers[0xF] = msb;
    this.registers[vx] = this.registers[vx] << 1;
    this.program_counter += 2;
  }

  return {
    getOps: getOps
  };
});
