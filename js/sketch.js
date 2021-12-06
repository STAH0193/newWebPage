let randomShadow = ['#fcba03', '#03fcdb', '#ae00ff', 'red'];
let shadow = randomShadow[Math.floor(Math.random() * randomShadow.length)];

let randomColor = ['#fcba03', '#03fcdb', '#ae00ff'];
let col = randomColor[Math.floor(Math.random() * randomColor.length)];

function setup() {


  createCanvas(windowWidth, windowHeight);
  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = shadow;
}


function draw() {

document.getElementById('red-box').onclick = function() {
  clear();
}; 

  if (mouseIsPressed) {
    noStroke();
    fill(col);
    
  } else {
    noFill(); 
    noStroke();
  }

  circle(mouseX, mouseY, 60);

}

document.getElementById('blue-box').onclick = function() {
  drawingContext.shadowBlur = 50;
  drawingContext.shadowColor = shadow;
  
    let randomColor = ['#fcba03', '#03fcdb', '#ae00ff'];
    let randomShadow = ['#fcba03', '#03fcdb', '#ae00ff', 'red'];
    col = randomColor[Math.floor(Math.random() * randomColor.length)];
    shadow = randomShadow[Math.floor(Math.random() * randomShadow.length)];
  }
  


