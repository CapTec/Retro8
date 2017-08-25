requirejs(["interpreter/interpreter", 'helpers/asyncbinloader'], function(Interpreter, AsyncBinLoader) {
  var processor = new Interpreter();
  var loader = new AsyncBinLoader();
  var canvas = document.getElementById('display');
  var context = canvas.getContext('2d');
  var multiplier = 10;
  var width = 64, height = 32;

  function cycle(timestamp) {
    var cycles = 0;
    while(!processor.render && cycles < 875) {
      processor.cycle();
      cycles++;
    }

    processor.render = false;

    context.clearRect(0, 0, canvas.width, canvas.height); // clear display

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var pixel = processor.display[x][y];

        if (pixel === 1) {
          context.fillStyle = 'rgb(255, 255, 255)';
          context.fillRect(x * multiplier, y * multiplier, multiplier, multiplier);
        }
      }
    }

    processor.handleTimers();
    window.requestAnimationFrame(cycle);
  }

  loader.load('binaries/file1.ch8', function(binary) {
    processor.loadProgram(binary)
    window.requestAnimationFrame(cycle);
  });
});
