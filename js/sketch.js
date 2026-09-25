// Pen (stroke) color and shadow color, set by the color-picker circles.
// Default to the first swatch in each row.
let penColor = '#fcba03';
let shadowColor = '#fcba03';

let boxX = 200;
let boxY = 200;
let baseSize = 200;
let hoverGrow = 50;

let dissolving = false;
let dissolveAlpha = 0;

let currentSize = baseSize;
let targetSize = baseSize;

let topOffset = 100;
let leftOffset = 10; // keep the canvas clear of the color picker & pen fader

// Range driven by the pen-size fader below.
let PEN_MIN = 10;
let PEN_MAX = 100;
let strokeWeightValue = 60;

function setup() {

  let c = createCanvas(windowWidth - leftOffset, windowHeight - topOffset);
  c.position(leftOffset, topOffset);
  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = shadowColor;
}

function windowResized() {
  resizeCanvas(windowWidth - leftOffset, windowHeight - topOffset);
}


function draw() {

document.getElementById('red-box').onclick = function() {
  dissolving = true;
  dissolveAlpha = 0;
}; 

  if (dissolving) {
    drawingContext.globalCompositeOperation = 'destination-out';
    noStroke();
    fill(0, 25);
    rect(0, 0, width, height);
    drawingContext.globalCompositeOperation = 'source-over';

    dissolveAlpha += 25;
    if (dissolveAlpha >= 255) {
      clear();
      dissolving = false;
    }
    return;
  }

  if (mouseIsPressed) {
    strokeCap(ROUND);
    strokeWeight(strokeWeightValue);
    stroke(penColor);
    line(pmouseX, pmouseY, mouseX, mouseY);

  } else {
    noStroke();
  }


}

const redBox = document.getElementById('red-box');

redBox.addEventListener('mouseenter', function() {
  redBox.style.transition = 'width 1s ease-out, height 1s ease-out, background-color 1s ease-out';
  redBox.style.width = '55px';
  redBox.style.height = '55px';
  redBox.style.backgroundColor = 'purple';
});

redBox.addEventListener('mouseleave', function() {
  redBox.style.transition = 'width 1s ease-out, height 1s ease-out, background-color 1s ease-out';
  redBox.style.width = '50px';
  redBox.style.height = '50px';
  redBox.style.background = 'radial-gradient(circle, rgba(227,232,0,0.72) 0%, rgba(255,0,0,1) 100%)';
});

// ---- COLOR PICKER -----------------------------------------------------------
// Top row (pen-circle) sets the drawing/stroke color.
// Bottom row (shadow-circle) sets the canvas shadow color.
document.querySelectorAll('.pen-circle').forEach(function (el) {
  el.addEventListener('click', function () {
    penColor = el.dataset.color;
  });
});

document.querySelectorAll('.shadow-circle').forEach(function (el) {
  el.addEventListener('click', function () {
    shadowColor = el.dataset.color;
    if (typeof drawingContext !== 'undefined') {
      drawingContext.shadowColor = shadowColor;
    }
  });
});

// ---- PEN SIZE FADER --------------------------------------------------------
// Replaces the old blue-box clicks. Reuses the initSquiggleFader helper
// defined in synth.js; wait for DOMContentLoaded so it doesn't matter
// which of synth.js / sketch.js is included first in the page.
document.addEventListener('DOMContentLoaded', function () {
  if (typeof initSquiggleFader !== 'function') return;

  // Stretch the vertical pen fader to match the rendered height of the
  // color picker, so it spans all 8 color-circle rows edge to edge.
  function sizePenFader() {
    var picker = document.getElementById('color-picker');
    var penSvg = document.getElementById('pen-fader');
    if (picker && penSvg) {
      penSvg.style.height = picker.offsetHeight + 'px';
    }
  }
  sizePenFader();
  window.addEventListener('resize', sizePenFader);

  // Default to the old default weight (60px) expressed as a percent
  // of the 10-100 range.
  var defaultPercent = (60 - PEN_MIN) / (PEN_MIN - PEN_MAX);

  initSquiggleFader('pen-fader', 'pen-track', 'pen-dot', function (percent) {
    strokeWeightValue = PEN_MAX + percent * (PEN_MIN - PEN_MAX);
  }, defaultPercent, 'vertical');
});
// ---- VOLUME FADER SIZING ---------------------------------------------------
// The vertical fader (now volume, wired up in synth.js) is stretched to
// match the rendered height of the color picker.
document.addEventListener('DOMContentLoaded', function () {
  function sizePenFader() {
    var picker = document.getElementById('color-picker');
    var penSvg = document.getElementById('pen-fader');
    if (picker && penSvg) {
      penSvg.style.height = picker.offsetHeight + 'px';
    }
  }
  sizePenFader();
  window.addEventListener('resize', sizePenFader);
});