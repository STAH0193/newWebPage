// Current oscillator waveform, selected via the blue-box buttons below.
var currentWaveform = 'sine';

document.addEventListener("mousedown", function (e) {

  if (e.clientY < 100) {
    return;
  }

  var ctx = new (window.AudioContext || window.webkitAudioContext)();

  let set1 = ['196', '220', '246.94', '277.18', '293.66', '329.63', '369.63', '392'];
  let set2 = ['293.66', '329.63', '369.99', '415.30', '440', '493.88', '554.37', '587.33'];
  let set3 = ['440', '493.88', '554.37', '622.25', '659.25', '739.99', '830.61', '880'];

  var set = [set1, set2, set3];

  let randomSet = set[Math.floor(Math.random() * set.length)];

  let freq = randomSet[Math.floor(Math.random() * randomSet.length)];
  let freq2 = randomSet[Math.floor(Math.random() * randomSet.length)];

  //OSCILLATOR//
  var osc1 = ctx.createOscillator();
  var osc2 = ctx.createOscillator();
  osc1.type = currentWaveform;
  osc2.type = currentWaveform;

  //PAN//
  var panNodeL = ctx.createStereoPanner();
  var panNodeR = ctx.createStereoPanner();

  //FILTER//
  var LPfilterL = ctx.createBiquadFilter();
  var LPfilterR = ctx.createBiquadFilter();

  //GAIN//
  var gainNodeL = ctx.createGain();
  var gainNodeR = ctx.createGain();

  //OSC CONTROL//
  osc1.frequency.setValueAtTime(freq, ctx.currentTime);
  osc2.frequency.setValueAtTime(freq2, ctx.currentTime);

  //PAN CONTROL//
  panNodeL.pan.value = -1;
  panNodeR.pan.value = 1;

  //GAIN CONTROL//
  gainNodeL.gain.linearRampToValueAtTime(0.0, ctx.currentTime);
  gainNodeL.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 1.5);
  gainNodeL.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);

  gainNodeR.gain.linearRampToValueAtTime(0.0, ctx.currentTime);
  gainNodeR.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 1.5);
  gainNodeR.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.5);

  //FILTER CONTROL//
  LPfilterL.type = "lowpass";
  LPfilterL.frequency.value = 1200;

  LPfilterR.type = "lowpass";
  LPfilterR.frequency.value = 1200;

  //PATCH BAY//
  osc1.connect(panNodeL);
  osc2.connect(panNodeR);
  panNodeL.connect(gainNodeL);
  panNodeR.connect(gainNodeR);
  gainNodeL.connect(LPfilterL);
  gainNodeR.connect(LPfilterR);
  LPfilterL.connect(ctx.destination);
  LPfilterR.connect(ctx.destination);

  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);

  // Stop oscillators after the envelope finishes and free the AudioContext
  var stopTime = ctx.currentTime + 2.5;
  osc1.stop(stopTime);
  osc2.stop(stopTime);
  osc2.onended = function () {
    ctx.close();
  };
});

var redBox2 = document.getElementById('red-box');
if (redBox2) {
  redBox2.addEventListener("click", function () {

    var ctx = new (window.AudioContext || window.webkitAudioContext)();

    let randomFreq = ['350', '300', '400', '500', '600'];
    let freq = randomFreq[Math.floor(Math.random() * randomFreq.length)];

    let randomFreq2 = ['100', '150', '650'];
    let freq2 = randomFreq2[Math.floor(Math.random() * randomFreq2.length)];

    var osc4 = ctx.createOscillator();
    var gain4 = ctx.createGain();
    osc4.type = 'square';

    osc4.frequency.setValueAtTime(freq, ctx.currentTime);
    osc4.frequency.linearRampToValueAtTime(freq2, ctx.currentTime + 1);

    gain4.gain.linearRampToValueAtTime(0.0, ctx.currentTime);
    gain4.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1);
    gain4.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

    osc4.connect(gain4);
    gain4.connect(ctx.destination);

    osc4.start(ctx.currentTime);

    var stopTime = ctx.currentTime + 2;
    osc4.stop(stopTime);
    osc4.onended = function () {
      ctx.close();
    };
  });
}

// Waveform select buttons
var blueBox01 = document.getElementById('blue-box');
if (blueBox01) {
  blueBox01.addEventListener("click", function () {
    currentWaveform = 'sine';
  });
}

var blueBox02 = document.getElementById('blue-box2');
if (blueBox02) {
  blueBox02.addEventListener("click", function () {
    currentWaveform = 'triangle';
  });
}

var blueBox03 = document.getElementById('blue-box3');
if (blueBox03) {
  blueBox03.addEventListener("click", function () {
    currentWaveform = 'square';
  });
}