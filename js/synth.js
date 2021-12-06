

document.addEventListener("mousedown", function(){

var ctx = new(window.AudioContext || window.webkitAudioContext)();

let randomFreq = ['196', '220', '246.94', '277.18', '293.66', '329.63', '369.63', '392'];
let freq = randomFreq[Math.floor(Math.random() * randomFreq.length)];

let randomFreq2 = ['196', '220', '246.94', '277.18', '293.66', '329.63', '369.63', '392'];
let freq2 = randomFreq2[Math.floor(Math.random() * randomFreq2.length)];

//OSCILLATOR//
var osc1 = ctx.createOscillator();
var osc2 = ctx.createOscillator();


//PAN//
var panNodeL = ctx.createStereoPanner();
var panNodeR = ctx.createStereoPanner();

//FILTER//
var HPfilterL = ctx.createBiquadFilter();
var HPfilterR = ctx.createBiquadFilter();


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
HPfilterL.type = "highpass";
HPfilterL.frequency.setTargetAtTime(2000, ctx.currentTime, 10);

HPfilterR.type = "highpass";
HPfilterR.frequency.setTargetAtTime(2000, ctx.currentTime, 10);



//PATCH BAY//
osc1.connect(panNodeL);
osc2.connect(panNodeR);
panNodeL.connect(gainNodeL);
panNodeR.connect(gainNodeR);
gainNodeL.connect(HPfilterL);
gainNodeR.connect(HPfilterR);
HPfilterL.connect(ctx.destination);
HPfilterR.connect(ctx.destination);

osc1.start(ctx.currentTime);
osc2.start(ctx.currentTime);



});

document.getElementById('blue-box').addEventListener("click", function() {

    var ctx = new(window.AudioContext || window.webkitAudioContext)();

    let randomFreq = ['525', '400', '129'];
    let freq = randomFreq[Math.floor(Math.random() * randomFreq.length)];

    var osc3 = ctx.createOscillator();
    var gain = ctx.createGain();
    
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

    osc3.connect(gain);
    gain.connect(ctx.destination);

    osc3.start(ctx.currentTime);

})

document.getElementById('red-box').addEventListener("click", function() {

    var ctx = new(window.AudioContext || window.webkitAudioContext)();

    let randomFreq = ['350', '300', '400', '500', '600'];
    let freq = randomFreq[Math.floor(Math.random() * randomFreq.length)];

    let randomFreq2 = ['100', '150', '650'];
    let freq2 = randomFreq2[Math.floor(Math.random() * randomFreq.length)];

    osc4 = ctx.createOscillator();
    var gain4 = ctx.createGain();
    osc4.type = 'square'

    osc4.frequency.setValueAtTime(freq, ctx.currentTime);
    osc4.frequency.linearRampToValueAtTime(freq2, ctx.currentTime + 1);

    gain4.gain.linearRampToValueAtTime(0.0, ctx.currentTime);
    gain4.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1);
    gain4.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);



    osc4.connect(gain4);
    gain4.connect(ctx.destination);

    osc4.start(ctx.currentTime);

});

