define(['./errors/notimplemented'], function(CodeNotImplemented) {
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
    this.program_counter += 4;
    throw new CodeNotImplemented(opcode);
  }

  /*
   * Skips the next instruction if the key stored in VX isn't pressed.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(key() != Vx)
   * operator type: Keyboard
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function skipIfVxNotPressed(opcode) {
    this.program_counter += 4;
    throw new CodeNotImplemented(opcode);
  }

  return {
    getOps: getOps
  };
});
