define(['./notimplemented'], function(CodeNotImplemented) {
  'use strict';

  var operations = {
    0x0007: setVxToDelay,
    0x000A: setVxToKey,
    0x0015: setDelayTimer,
    0x0018: setSoundTimer,
    0x001E: addVxToIdxReg,
    0x0029: setIdxToSprite,
    0x0033: setBcd,
    0x0055: regDump,
    0x0065: regLoad
  };

  function getOps(opcode) {
    return operations[(opcode & 0x00FF)];
  }

  /*
   * Sets VX to the value of the delay timer.
   * pseudo: Vx = get_delay()
   * operator type: Timer
   * opcode: FX07
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToDelay(opcode) {
    throw new CodeNotImplemented();
  }

  /*
   * A key press is awaited, and then stored in VX.
   * (Blocking Operation. All instruction halted until next key event)
   * pseudo: Vx = get_key()
   * operator type: Keyboard
   * opcode: FX0A
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setVxToKey(opcode) {
    throw new CodeNotImplemented();
  }

  /*
   * Sets the delay timer to VX.
   * pseudo: 	delay_timer(Vx)
   * operator type: Timer
   * opcode: FX15
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setDelayTimer(opcode) {
    throw new CodeNotImplemented();
  }

  /*
   * Sets the sound timer to VX.
   * pseudo: 	sound_timer(Vx)
   * operator type: Timer
   * opcode: FX18
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setSoundTimer(opcode) {
    throw new CodeNotImplemented();
  }

  /*
   * Adds VX to I
   * pseudo: 	i += vx
   * operator type: Memory
   * opcode: FX1E
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function addVxToIdxReg(opcode) {
    throw new CodeNotImplemented();
  }

  /*
   * Sets I to the location of the sprite for the character in VX.
   * Characters 0-F (in hexadecimal) are represented by a 4x5 font.
   * pseudo: I=sprite_addr[Vx]
   * operator type: Memory
   * opcode: FX29
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setIdxToSprite(opcode) {
    throw new CodeNotImplemented();
  }

  /*
   * Stores the binary-coded decimal representation of VX, with the most significant of three digits at the address in I.
   * The middle digit at I plus 1, and the least significant digit at I plus 2.
   * (In other words, take the decimal representation of VX,
   * place the hundreds digit in memory at location in I,
   * the tens digit at location I+1, and the ones digit at location I+2.)
   * Characters 0-F (in hexadecimal) are represented by a 4x5 font.
   * pseudo: set_BCD(Vx);
   *         (I+0)=BCD(3);
   *         (I+1)=BCD(2);
   *         (I+2)=BCD(1);
   * operator type: Memory
   * opcode: FX33
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function setBcd(opcode) {
    throw new CodeNotImplemented();
  }

  /*
   * Stores V0 to VX (including VX) in memory starting at address I.
   * pseudo: reg_dump(Vx,&I)
   * operator type: Memory
   * opcode: FX55
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function regDump(opcode) {
    throw new CodeNotImplemented();
  }

  /*
   * Fills V0 to VX (including VX) with values from memory starting at address I.
   * pseudo: reg_load(Vx,&I)
   * operator type: Memory
   * opcode: FX65
   * @param {UInt8} opcode - 8 bit opcode value
   */
  function regLoad(opcode) {
    throw new CodeNotImplemented();
  }

  return {
    getOps: getOps
  };
});
