// ---- SYNTH SETTINGS --------------------------------------------------------

// Note names -> frequencies (Hz), equal temperament, A4 = 440.
var NOTE_FREQS = {
  C2: 65.41,  D2: 73.42,  E2: 82.41,  F2: 87.31,
  G2: 98.00,  Ab2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
  D3: 146.83, F3: 174.61
};

// Random pitch sets. Set by the bottom-row (shadow) color circles.
var PITCH_SETS = {
  '#fcba03': ['261.63', '329.63', '392.00', '440.00'], // C4, E4, G4, A4
  '#03fcdb': ['293.66', '349.23', '440.00', '493.88'], // D4, F4, A4, B4// D3, F3, A3, B3
  '#ae00ff': ['349.23', '220.00', '130.81', '293.66'], // F4, A3, C3, D4
  'red':     ['196.00', '246.94', '146.83', '164.81']  // G3, B3, D3, E3
};

// Default pitch set: the first shadow circle.
var currentPitchSet = PITCH_SETS['#fcba03'];

// Fixed overall output level (the vertical fader now controls waveform).
var MASTER_GAIN = 0.1;

// ---- WAVEFORM MIX ----------------------------------------------------------
// The vertical fader morphs continuously sine -> triangle -> rectangle.
// Top = pure sine, middle = pure triangle, bottom = pure rectangle, with
// linear crossfades in between.
//
// Each voice runs all three oscillators in phase, each through its own
// gain. Those gains are driven by three shared ConstantSourceNodes, so
// moving the fader reshapes every sounding note at once — held notes,
// releasing notes and delay tails included — with no clicks.
var WAVE_TYPES = ['sine', 'triangle', 'square'];

// Loudness compensation relative to sine (by RMS), so the mix doesn't
// jump in level as it moves: triangle is quieter, square much louder.
var WAVE_LEVEL = {
  sine: 1.0,
  triangle: 1.22,
  square: 0.707
};

var DEFAULT_WAVE_PERCENT = 0; // start on pure sine

// Echo delay: fixed, with 50% feedback for repeats.
var DELAY_MAX_SEC = 5;
var DELAY_TIME_SEC = 0.3;
var DELAY_FEEDBACK = 0.5;

// Envelope shape for held notes: quick attack up to a sustain level that
// holds for as long as the mouse/touch stays down, then a release ramp
// to silence once it's released. Release time is set by the horizontal
// fader: far left = 0.1s, far right = 5s, defaulting to 1s.
var ATTACK_TIME = 0.05;
var SUSTAIN_LEVEL = 0.8;
var RELEASE_MIN_SEC = 0.1;
var RELEASE_MAX_SEC = 5;
var releaseTimeSeconds = 1; // default

// The currently-held note (if any), so mouseup/touchend knows what to
// release. Only one note is held at a time, matching single-pointer input.
var currentNote = null;

// ---- SHARED AUDIO CONTEXT -------------------------------------------------
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var masterGain = audioCtx.createGain();
masterGain.gain.value = MASTER_GAIN;

// ---- TREMOLO ---------------------------------------------------------------
// Sits after the master gain so it shapes everything: notes, release tails,
// delay repeats and the red-box sweep. A sine LFO wobbles the tremolo
// gain around its centre. The top-right fader sets the depth:
// 0% = dry (gain steady at 1), 100% = fully wet (gain swings 0..1).
var TREMOLO_RATE_HZ = 5;
var TREMOLO_SMOOTHING = 0.08; // seconds; eases depth changes in gently

var tremoloGain = audioCtx.createGain();
tremoloGain.gain.value = 1;

var tremoloLFO = audioCtx.createOscillator();
tremoloLFO.type = 'sine';
tremoloLFO.frequency.value = TREMOLO_RATE_HZ;

var tremoloDepth = audioCtx.createGain();
tremoloDepth.gain.value = 0;

tremoloLFO.connect(tremoloDepth);
tremoloDepth.connect(tremoloGain.gain);
tremoloLFO.start();

masterGain.connect(tremoloGain);
tremoloGain.connect(audioCtx.destination);

function setTremoloFromPercent(percent) {
  percent = Math.max(0, Math.min(1, percent));
  var half = percent / 2;
  var now = audioCtx.currentTime;
  // Centre drops as depth rises, so the gain never exceeds 1.
  tremoloGain.gain.setTargetAtTime(1 - half, now, TREMOLO_SMOOTHING);
  tremoloDepth.gain.setTargetAtTime(half, now, TREMOLO_SMOOTHING);
}

// One control signal per waveform; its value is that waveform's mix level.
var waveMix = {};
WAVE_TYPES.forEach(function (type) {
  var src = audioCtx.createConstantSource();
  src.offset.value = 0;
  src.start();
  waveMix[type] = src;
});

function resumeAudioCtx() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// 0 = sine, 0.5 = triangle, 1 = rectangle, crossfading linearly between
// neighbours. Short smoothing ramp so dragging doesn't zipper.
function setWaveMixFromPercent(percent) {
  percent = Math.max(0, Math.min(1, percent));

  var w = { sine: 0, triangle: 0, square: 0 };
  if (percent <= 0.5) {
    var t = percent * 2;
    w.sine = 1 - t;
    w.triangle = t;
  } else {
    var u = (percent - 0.5) * 2;
    w.triangle = 1 - u;
    w.square = u;
  }

  var now = audioCtx.currentTime;
  WAVE_TYPES.forEach(function (type) {
    waveMix[type].offset.setTargetAtTime(w[type] * WAVE_LEVEL[type], now, 0.02);
  });
}

// Linear mapping across the release-time range.
function percentToReleaseTime(percent) {
  percent = Math.max(0, Math.min(1, percent));
  return RELEASE_MIN_SEC + percent * (RELEASE_MAX_SEC - RELEASE_MIN_SEC);
}

function randomFreqFromCurrentSet() {
  return Number(currentPitchSet[Math.floor(Math.random() * currentPitchSet.length)]);
}

// Builds one morphing oscillator: sine, triangle and square at the same
// frequency, started together so they stay phase-aligned, each scaled by
// its shared mix control and summed into a single output node.
function createMorphOsc(ctx, freq, now) {
  var output = ctx.createGain();
  var oscillators = [];

  WAVE_TYPES.forEach(function (type) {
    var osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    var mixGain = ctx.createGain();
    mixGain.gain.value = 0;              // level comes entirely from the control signal
    waveMix[type].connect(mixGain.gain);

    osc.connect(mixGain);
    mixGain.connect(output);

    // Unhook from the shared control once the voice is done, so finished
    // notes can be garbage-collected.
    osc.onended = function () {
      try { waveMix[type].disconnect(mixGain.gain); } catch (err) {}
      mixGain.disconnect();
    };

    osc.start(now);
    oscillators.push(osc);
  });

  return { output: output, oscillators: oscillators };
}

// Ramps the held note's gain down to silence and schedules its oscillators
// to stop once the release finishes. Safe to call with no note held.
function releaseCurrentNote() {
  if (!currentNote) return;

  var ctx = audioCtx;
  var now = ctx.currentTime;

  [currentNote.gainNodeL, currentNote.gainNodeR].forEach(function (gainNode) {
    var currentValue = gainNode.gain.value;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(currentValue, now);
    gainNode.gain.linearRampToValueAtTime(0, now + releaseTimeSeconds);
  });

  var stopAt = now + releaseTimeSeconds + 0.05;
  currentNote.oscillators.forEach(function (osc) {
    osc.stop(stopAt);
  });

  currentNote = null;
}

document.addEventListener("mousedown", function (e) {
  if (e.target.closest('#pen-fader, #color-picker')) return;
  if (e.clientY < 100) {
    return;
  }

  // A new press replaces whatever was held before.
  releaseCurrentNote();

  resumeAudioCtx();
  var ctx = audioCtx;
  var now = ctx.currentTime;

  var freq = randomFreqFromCurrentSet();
  var freq2 = randomFreqFromCurrentSet();

  //OSCILLATORS (each one a sine/triangle/rectangle morph)//
  var voiceL = createMorphOsc(ctx, freq, now);
  var voiceR = createMorphOsc(ctx, freq2, now);

  //PAN//
  var panNodeL = ctx.createStereoPanner();
  var panNodeR = ctx.createStereoPanner();

  //DELAY (with feedback)//
  var delayL = ctx.createDelay(DELAY_MAX_SEC);
  var delayR = ctx.createDelay(DELAY_MAX_SEC);
  var feedbackGainL = ctx.createGain();
  var feedbackGainR = ctx.createGain();

  //GAIN//
  var gainNodeL = ctx.createGain();
  var gainNodeR = ctx.createGain();

  //PAN CONTROL//
  panNodeL.pan.value = -1;
  panNodeR.pan.value = 1;

  //GAIN CONTROL (attack up to sustain, then hold until released)//
  gainNodeL.gain.setValueAtTime(0, now);
  gainNodeL.gain.linearRampToValueAtTime(SUSTAIN_LEVEL, now + ATTACK_TIME);

  gainNodeR.gain.setValueAtTime(0, now);
  gainNodeR.gain.linearRampToValueAtTime(SUSTAIN_LEVEL, now + ATTACK_TIME);

  //DELAY CONTROL//
  delayL.delayTime.value = DELAY_TIME_SEC;
  delayR.delayTime.value = DELAY_TIME_SEC;

  feedbackGainL.gain.value = DELAY_FEEDBACK;
  feedbackGainR.gain.value = DELAY_FEEDBACK;

  //PATCH BAY//
  voiceL.output.connect(panNodeL);
  voiceR.output.connect(panNodeR);
  panNodeL.connect(gainNodeL);
  panNodeR.connect(gainNodeR);

  // Dry signal straight to the output...
  gainNodeL.connect(masterGain);
  gainNodeR.connect(masterGain);

  // ...plus a delayed copy that feeds back into itself for repeats.
  gainNodeL.connect(delayL);
  gainNodeR.connect(delayR);
  delayL.connect(feedbackGainL);
  feedbackGainL.connect(delayL);
  delayR.connect(feedbackGainR);
  feedbackGainR.connect(delayR);
  delayL.connect(masterGain);
  delayR.connect(masterGain);

  currentNote = {
    oscillators: voiceL.oscillators.concat(voiceR.oscillators),
    gainNodeL: gainNodeL,
    gainNodeR: gainNodeR
  };
});

document.addEventListener('mouseup', releaseCurrentNote);
document.addEventListener('touchend', releaseCurrentNote);
document.addEventListener('touchcancel', releaseCurrentNote);

// ---- COLOR CIRCLES -> SYNTH ------------------------------------------------
// Bottom row (shadow-circle) picks the random pitch set.
// (sketch.js separately uses these same clicks for pen/shadow color.)

document.querySelectorAll('.pen-circle').forEach(function (el) {
  el.addEventListener('click', function () {
    var set = PITCH_SETS[el.dataset.color];
    if (set) currentPitchSet = set;
  });
});

var redBox2 = document.getElementById('red-box');
if (redBox2) {
  redBox2.addEventListener("click", function () {

    resumeAudioCtx();
    var ctx = audioCtx;

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
    gain4.connect(masterGain);

    osc4.start(ctx.currentTime);

    var stopTime = ctx.currentTime + 2;
    osc4.stop(stopTime);
  });
}

// ---- SQUIGGLE FADERS -------------------------------------------------------
// Shared drag behavior for all faders: the dot tracks the pointer's
// position along the path continuously, and reports a 0..1 percent to
// the given callback.
function initSquiggleFader(svgId, trackId, dotId, onChange, initialPercent, orientation) {
  var svg = document.getElementById(svgId);
  var track = document.getElementById(trackId);
  var dot = document.getElementById(dotId);
  if (!svg || !track || !dot) return;

  orientation = orientation || 'horizontal';
  var pathLength = track.getTotalLength();
  var dragging = false;

  function setFromPercent(percent) {
    percent = Math.max(0, Math.min(1, percent));
    var point = track.getPointAtLength(percent * pathLength);
    dot.setAttribute('cx', point.x);
    dot.setAttribute('cy', point.y);
    onChange(percent);
  }

  function percentFromEvent(e) {
    var rect = svg.getBoundingClientRect();
    if (orientation === 'vertical') {
      var clientY = (e.touches ? e.touches[0].clientY : e.clientY);
      return (clientY - rect.top) / rect.height;
    }
    var clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    return (clientX - rect.left) / rect.width;
  }

  function onPointerDown(e) {
    dragging = true;
    resumeAudioCtx();
    setFromPercent(percentFromEvent(e));
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    setFromPercent(percentFromEvent(e));
  }

  function onPointerUp() {
    dragging = false;
  }

  svg.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  svg.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);

  setFromPercent(initialPercent);
}

// Vertical fader: waveform morph. Top = sine, middle = triangle,
// bottom = rectangle.
initSquiggleFader('pen-fader', 'pen-track', 'pen-dot', function (percent) {
  setWaveMixFromPercent(percent);
}, DEFAULT_WAVE_PERCENT, 'vertical');

// Horizontal fader: release time. Far left = 0.1s, far right = 5s, defaults to 1s.
var defaultReleasePercent = (releaseTimeSeconds - RELEASE_MIN_SEC) / (RELEASE_MAX_SEC - RELEASE_MIN_SEC);
initSquiggleFader('release-fader', 'release-track', 'release-dot', function (percent) {
  releaseTimeSeconds = percentToReleaseTime(percent);
}, defaultReleasePercent);

// Horizontal fader 2: tremolo depth. Far left = 0% (dry), far right = 100%.
initSquiggleFader('tremolo-fader', 'tremolo-track', 'tremolo-dot', function (percent) {
  setTremoloFromPercent(percent);
}, 0);