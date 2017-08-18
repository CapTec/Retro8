define(function() {
  'use strict';

  var operations = {
    0x009E: skipIfVxPressed,
    0x00A1: skipIfVxNotPressed
  };

  function getOps(opcode) {
    return operations[(opcode & 0x00FF)];
  }

  /*
   * Skips the next instruction if the key stored in VX is pressed.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(key() == Vx)
   * operator type: Keyboard
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function skipIfVxPressed(opcode) {
    var vx = (opcode & 0x0F00) >> 8;
    var key = this.registers[vx];

    if(this.keyboard[key] === 0x1) {
      this.program_counter += 2;
    }

    this.program_counter += 2;
  }

  /*
   * Skips the next instruction if the key stored in VX isn't pressed.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(key() != Vx)
   * operator type: Keyboard
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function skipIfVxNotPressed(opcode) {
    var vx = (opcode & 0x0F00) >> 8;
    var key = this.registers[vx];

    if(this.keyboard[key] === 0x0) {
      this.program_counter += 2;
    }

    this.program_counter += 2;
  }

  return {
    getOps: getOps
  };
});
