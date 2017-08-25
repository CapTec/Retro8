define(['./errors/notimplemented'], function(CodeNotImplemented) {
  'use strict';

  var operations = {
    0x00E0: clearDisplay,
    0x00EE: returnFrom
  };

  function getOps(opcode) {
    var op = operations[(opcode & 0x0FFF)];

    if (typeof op === 'undefined')
      op = callRca;

    return op;
  }

  /*
   * Calls RCA 1802 program at address NNN. Not necessary for most Chip8 Software.
   * pseudo: n/a
   * operator type: Call
   * opcode: 0x0NNN
   * @param {UInt16} opcode - 16 bit operand word
   */
  function callRca(opcode, self) {
    throw new CodeNotImplemented(opcode);
  }

  /*
   * Clears the screen.
   * pseudo: disp_clear()
   * operator type: Display/Graphics
   * opcode: 0x00E0
   * @param {UInt16} opcode - 16 bit operand word
   */
  function clearDisplay(opcode, self) {
    for (var y = 0; y < 32; y++) {
      for (var x = 0; x < 64; x++) {
        self.display[x][y] = 0x0;
      }
    }

    self.render = true;

  }

  /*
   * Returns from a subroutine
   * pseudo: return;
   * operator type: Flow
   * opcode: 0x00EE
   * @param {UInt16} opcode - 16 bit operand word
   */
  function returnFrom(opcode, self) {
    self.program_counter = self.stack[self.stack_pointer];
    self.stack_pointer--;
  }

  return {
    getOps: getOps
  };
});
