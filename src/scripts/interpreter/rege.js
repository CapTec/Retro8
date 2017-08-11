define(['./notimplemented'], function(CodeNotImplemented) {
  'use strict';

  var operations = {
    0x000E: skipIfVxPressed,
    0x0001: skipIfVxNotPressed
  };

  function getOps(opcode) {
    return operations[(opcode & 0x000F)];
  }

  /*
   * Skips the next instruction if the key stored in VX is pressed.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(key() == Vx)
   * operator type: Keyboard
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function skipIfVxPressed(opcode) {
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
    throw new CodeNotImplemented(opcode);
  }

  return {
    getOps: getOps
  };
});
