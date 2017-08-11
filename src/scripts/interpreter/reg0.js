define(['./notimplemented'],function(CodeNotImplemented) {
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
   * Calls RCA 1802 program at address NNN. Not necessary for most ROMs.
   * pseudo: n/a
   * operator type: Call
   * opcode: 0x0NNN
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function callRca(opcode) {
    throw new CodeNotImplemented(opcode);
  }

  /*
   * Clears the screen.
   * pseudo: disp_clear()
   * operator type: Display/Graphics
   * opcode: 0x00E0
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function clearDisplay(opcode) {
    throw new CodeNotImplemented(opcode);
  }

  /*
   * Returns from a subroutine
   * pseudo: return;
   * operator type: Flow
   * opcode: 0x00EE
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function returnFrom(opcode) {
    throw new CodeNotImplemented(opcode);
  }

  return {
    getOps: getOps
  };
});
