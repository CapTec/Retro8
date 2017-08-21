define(function() {
  'use strict';

  var operations = {
    0x009E: skipIfVxPressed,
    0x00A1: skipIfVxNotPressed
  };

  function getOps(opcode, self) {
    return operations[(opcode & 0x00FF)];
  }

  /*
   * Skips the next instruction if the key stored in VX is pressed.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(key() == Vx)
   * operator type: Keyboard
   * @param {UInt16} opcode - 16 bit operand word
   */
  function skipIfVxPressed(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8;
    var key = self.registers[vx];

    if (self.keyboard[key] === 0x1) {
      self.program_counter += 2;
    }

    self.program_counter += 2;
  }

  /*
   * Skips the next instruction if the key stored in VX isn't pressed.
   * (Usually the next instruction is a jump to skip a code block)
   * psuedo: if(key() != Vx)
   * operator type: Keyboard
   * @param {UInt16} opcode - 16 bit operand word
   */
  function skipIfVxNotPressed(opcode, self) {
    var vx = (opcode & 0x0F00) >> 8;
    var key = self.registers[vx];

    if (self.keyboard[key] === 0x0) {
      self.program_counter += 2;
    }

    self.program_counter += 2;
  }

  return {
    getOps: getOps
  };
});
