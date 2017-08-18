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
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function callRca(opcode, self) {
    throw new CodeNotImplemented(opcode);
  }

  /*
   * Clears the screen.
   * pseudo: disp_clear()
   * operator type: Display/Graphics
   * opcode: 0x00E0
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function clearDisplay(opcode, self) {
    var width = self.display.length;
    for (var i = 0; i < width; i++) {
      var height = self.display[i].length;
      for (var j = 0; j < height; j++) {
        self.display[i][j] = 0;
      }
    }
    self.program_counter += 2;
  }

  /*
   * Returns from a subroutine
   * pseudo: return;
   * operator type: Flow
   * opcode: 0x00EE
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function returnFrom(opcode, self) {
    // The interpreter sets the program counter to the address at the top of the stack, then subtracts 1 from the stack pointer.
    self.program_counter = self.stack[self.stack.length - 1];
    self.stack_pointer -= 1;
  }

  return {
    getOps: getOps
  };
});
