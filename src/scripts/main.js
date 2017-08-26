requirejs(["interpreter/interpreter", 'helpers/asyncbinloader', 'helpers/keyboardhandler'], function(Interpreter, AsyncBinLoader, KeyboardHandler) {
  var processor = new Interpreter();
  var loader = new AsyncBinLoader();
  var keyHandler = new KeyboardHandler(processor.keyboard);
  var canvas = document.getElementById('display');
  var context = canvas.getContext('2d');

  var width = 64,
    height = 32,
    aspect_ratio = 2;

  var frameBufferWidth = canvas.clientWidth;
  var frameBufferHeight = canvas.clientWidth / aspect_ratio;
  var multiplier = 10;

  function cycle(timestamp) {
    var cycles = 0;
    if (!processor.running)
      return;

    while (!processor.render && cycles < 875 && processor.running) {
      processor.cycle();
      cycles++;
    }

    if (!processor.running)
      return;

    processor.render = false;

    context.clearRect(0, 0, frameBufferWidth, frameBufferHeight); // clear display

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

  function initialize(binary) {
    keyHandler.addListeners(document);
    processor.loadProgram(binary);
    processor.running = true;
    window.requestAnimationFrame(cycle);
  }

  loader.load('binaries/file1.ch8', initialize);


  var select = document.querySelector('select');
  select.addEventListener('change', function(e) {
    processor.running = false;
    processor.reset();
    keyHandler.removeListeners(document);
    keyHandler = new KeyboardHandler(processor.keyboard);
    var option = select.options[select.selectedIndex];
    loader.load('binaries/' + option.value, initialize);
  });
});
