requirejs(["interpreter/interpreter"], function(Interpreter) {
    var processor = new Interpreter();
    console.log(processor.decodeOp(0x1F00));
    console.log(processor);
});
