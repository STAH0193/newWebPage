let randomShadow = ['#fcba03', '#03fcdb', '#ae00ff', 'red'];
let shadow = randomShadow[Math.floor(Math.random() * randomShadow.length)];

let randomColor = ['#fcba03', '#03fcdb', '#ae00ff'];
let col = randomColor[Math.floor(Math.random() * randomColor.length)];

let boxX = 200;
let boxY = 200;
let baseSize = 200;
let hoverGrow = 50;

let dissolving = false;
let dissolveAlpha = 0;

let currentSize = baseSize;
let targetSize = baseSize;

let topOffset = 100;

function setup() {

  let c = createCanvas(windowWidth, windowHeight - topOffset);
  c.position(0, topOffset);
  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = shadow;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - topOffset);
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
    strokeWeight(60);
    stroke(col);
    line(pmouseX, pmouseY, mouseX, mouseY);

  } else {
    noStroke();
  }

  if (mouseIsPressed) {
    strokeCap(ROUND);
    strokeWeight(60);
    stroke(col);
    line(pmouseX, pmouseY, mouseX, mouseY);
    
  } else {
    noFill(); 
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

document.getElementById('blue-box').onclick = function() {
  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = shadow;
  
    let randomColor = ['#fcba03', '#03fcdb', '#ae00ff'];
    let randomShadow = ['#fcba03', '#03fcdb', '#ae00ff', 'red'];
    col = randomColor[Math.floor(Math.random() * randomColor.length)];
    shadow = randomShadow[Math.floor(Math.random() * randomShadow.length)];
  }

document.getElementById('blue-box2').onclick = function() {
  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = shadow;
  
    let randomColor = ['#fcba03', '#03fcdb', '#ae00ff'];
    let randomShadow = ['#fcba03', '#03fcdb', '#ae00ff', 'red'];
    col = randomColor[Math.floor(Math.random() * randomColor.length)];
    shadow = randomShadow[Math.floor(Math.random() * randomShadow.length)];
  }

  document.getElementById('blue-box3').onclick = function() {
  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = shadow;
  
    let randomColor = ['#fcba03', '#03fcdb', '#ae00ff'];
    let randomShadow = ['#fcba03', '#03fcdb', '#ae00ff', 'red'];
    col = randomColor[Math.floor(Math.random() * randomColor.length)];
    shadow = randomShadow[Math.floor(Math.random() * randomShadow.length)];
  }

const blueBox = document.getElementById('blue-box');
const blueBox2 = document.getElementById('blue-box2');
const blueBox3 = document.getElementById('blue-box3');



blueBox.addEventListener('mouseenter', function() {
  blueBox.style.transition = 'width 1s ease-out, height 1s ease-out';
  blueBox.style.width = '55px';
  blueBox.style.height = '55px';
});

blueBox.addEventListener('mouseleave', function() {
  blueBox.style.transition = 'width 1s ease-out, height 1s ease-out';
  blueBox.style.width = '50px';
  blueBox.style.height = '50px';
});

blueBox2.addEventListener('mouseenter', function() {
  blueBox2.style.transition = 'width 1s ease-out, height 1s ease-out';
  blueBox2.style.width = '45px';
  blueBox2.style.height = '45px';
});

blueBox2.addEventListener('mouseleave', function() {
  blueBox2.style.transition = 'width 1s ease-out, height 1s ease-out';
  blueBox2.style.width = '40px';
  blueBox2.style.height = '40px';
});

blueBox3.addEventListener('mouseenter', function() {
  blueBox3.style.transition = 'width 1s ease-out, height 1s ease-out';
  blueBox3.style.width = '35px';
  blueBox3.style.height = '35px';
});

blueBox3.addEventListener('mouseleave', function() {
  blueBox3.style.transition = 'width 1s ease-out, height 1s ease-out';
  blueBox3.style.width = '30px';
  blueBox3.style.height = '30px';
});