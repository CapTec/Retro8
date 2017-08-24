define(function() {
  'use strict';

  function AsyncBinLoader() {
    this.load = load;
  }

  function load(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.overrideMimeType('text\/plain; charset=x-user-defined');

    xhr.addEventListener('readystatechange', function(event) {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        
        callback.call(null, textToBinary(xhr.responseText));
      }
    });

    xhr.send(null);
  }

  function textToBinary(text) {
    var binary = new Uint8Array(text.length);

    for(var i = 0; i < text.length; i++) {
      binary[i] = (text.charCodeAt(i) & 0xFF);
    }

    return binary;
  }

  return AsyncBinLoader;
});
