//Global variable List
const unitLength = 15;
const boxColor = 150;
const stasisBoxColor = "blue";
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let slider;
let canvas;
let mode = "drawing";
let pattern;
let value = 255;
let cursorX = 0;
let cursorY = 0;
let isGameOn = true;
let fr = 5;

let rgbColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
  Math.random() * 256
)}, ${Math.floor(Math.random() * 256)})`;

/* Get the user input for the Well-known pattern*/
let inputGosperGliderGun = document.querySelector("#Gun");
inputGosperGliderGun.addEventListener("click", () => {
  alert("Gosper Glider Gun pattern has been selected.");
  mode = "drawing";
  pattern = "GosperGliderGunPattern";
  mousePressed();
});

let inputGlider = document.querySelector("#Glider");
inputGlider.addEventListener("click", () => {
  alert("Glider pattern has been selected.");
  mode = "drawing";
  pattern = "GliderPattern";
  mousePressed();
});

let inputTrain = document.querySelector("#Train");
inputTrain.addEventListener("click", () => {
  alert("Train pattern has been selected.");
  mode = "drawing";
  pattern = "TrainPattern";
  mousePressed();
});

let inputDragon = document.querySelector("#Dragon");
inputDragon.addEventListener("click", () => {
  alert("Dragon pattern has been selected.");
  mode = "drawing";
  pattern = "DragonPattern";
  mousePressed();
});

//Submit the setting to start the game
/*Get the user input for the survival and birth rules*/
let ruleBirth = 3;
let ruleReproduce = 3;
let ruleSurviveOne = 2;
let ruleSurviveTwo = 3;
let inputSurviveOne = document.querySelector("#inputSurvive1");
let inputSurviveTwo = document.querySelector("#inputSurvive2");
let inputReproduce = document.querySelector("#inputReproduce");
let submitButton = document.querySelector("#submitRules");

submitButton.addEventListener("click", () => {
  ruleSurviveOne = parseInt(inputSurviveOne.value); //Die of loneliness
  ruleSurviveTwo = parseInt(inputSurviveTwo.value); //Die of overpopulation
  ruleReproduce = parseInt(inputReproduce.value);

  console.log("submitted", ruleSurviveOne, ruleSurviveTwo, ruleReproduce);
  init();
  isGameOn = true;
  loop();
});

//Start the game with the "Start button"
const start = document.querySelector("#start-button");
start.onclick = function (event) {
  isGameOn = true;
  loop();
};

//Stop the game with the "Stop button"
const stop = document.querySelector("#stop-button");
stop.onclick = function (event) {
  isGameOn = false;
  noLoop();
};

//Initial the random initial state
let initialRandom = document.querySelector("#restart-button-random");
initialRandom.onclick = function (event) {
  init();
};

//Initial the null initial state
let initialScratch = document.querySelector("#restart-button-scratch");
initialScratch.onclick = function (event) {
  initNull();
};

//Select the keyboard mode
let keyboard = document.querySelector("#keyboard");
keyboard.addEventListener("click", ()=> {
  mode = "keyboard";
  // console.log("keyboard mode is selected.")
  isGameOn = true;
  document.querySelector("#mode-display").innerHTML = "Mode: Keyboard"
  keyPressed();
});

 //Selct the cursor mode
 let drawing = document.querySelector("#cursor-drawing");
 drawing.addEventListener("click", () => {
   mode = "drawing";
   console.log("drawing mode is selected.",mode);
   document.querySelector("#mode-display").innerHTML = "Mode: Drawing"
   mouseMoved();
 });

function setup() {
  /* Set the canvas to be under the element #canvas*/
  canvas = createCanvas(
    int((windowWidth * 0.8) / unitLength) * unitLength,
    int((windowHeight * 0.8) / unitLength) * unitLength
  );
  canvas.parent(document.querySelector("#canvas"));

  slider = createSlider(1, 60, 5, 1);
  slider.parent("#slider-bar");
  slider.style("width", "100px");

  //initial frameRate;
  frameRate(fr);

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }

  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard

  //Resize board on windows resize
  addEventListener("resize", () => {
    heightOutput = window.innerHeight;
    widthOutput = window.innerWidth;

    windowHeight = heightOutput;
    windowWidth = widthOutput;

    // Recalculate the number of columns and rows based on the window size
    columns = floor(windowWidth / unitLength);
    rows = floor(windowHeight / unitLength);

    // Make both currentBoard and nextBoard 2-dimensional matrices based on the number of columns and rows
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
      currentBoard[i] = [];
      nextBoard[i] = [];
    }

    // Set the initial values of the currentBoard and nextBoard
    init();
  });
}

//------------------------------------------------------------------------------------
function windowResized() {
  resizeCanvas(
    int((windowWidth * 0.8) / unitLength) * unitLength,
    int((windowHeight * 0.8) / unitLength) * unitLength
  );
}

//------------------------------------------------------------------------------------
//Initialize/reset the board state
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = random() > 0.4 ? 1 : 0; // one line if
      // currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

//Initialize/reset the board state with nothing
function initNull() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // currentBoard[i][j] = random() > 0.3 ? 1 : 0; // one line if
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

//------------------------------------------------------------------------------------
//Draw the board state
function draw() {
  fr = slider.value()
  frameRate(fr);

  background(255);
  generate();
  gridDraw();
  //Create life cell on the grip
}

//Draw the grid on the canvas
function gridDraw() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (currentBoard[i][j] == 1) {
        if (currentBoard[i][j] == nextBoard[i][j]) {
          fill(stasisBoxColor); //Stasis cell
        } else {
          fill(rgbColor);
        }
      } else {
        fill(255); // Dead cells
      }
      stroke(strokeColor);
      strokeWeight(1);
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
}



function mouseMoved() {
  if (mouseX > unitLength * columns || mouseY > unitLength * rows || mouseX <0 || mouseY<0) {
    // console.log("mouse move if.");
    return;
  } else {
    if (mode == "keyboard") {
        return;
    } else if(mode == "drawing") {
      // console.log("mouse move else.");
      cursorPreview();
      
    } 
  }
}

function cursorPreview() {
  if (mode == "keyboard") {
    return;
  } else if (mode == "drawing") {
    if (!isGameOn) {
      // console.log("repaint background");
      gridDraw();
    }
  
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    // console.log("mouse is moving", x, y);
  
    stroke("red");
    strokeWeight(3);
    noFill();
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
  }
}


  
function generate() {
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          neighbors +=
            currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < ruleSurviveOne) {
        // Die of loneliness
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 1 && neighbors > ruleSurviveTwo) {
        // Die of overpopulation
        nextBoard[x][y] = 0;
      } else if (currentBoard[x][y] == 0 && ruleReproduce == neighbors) {
        // Reproduce
        nextBoard[x][y] = 1;
      } else {
        //Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

//------------------------------------------------------------------------------------
//Mouse is dragged
function mouseDragged() {
  // To prove the mouseDragged() is working as expected
  // console.log("get canvas position", canvas.position());
  // console.log("mouseX", mouseX, ",mouseY", mouseY);
  // console.log("x limit", unitLength * columns, ",y limit", unitLength * rows);

  //If the mouse coordinate is outside the board
  if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
    // console.log("out!");

    /* Trigger the change() method to return the updated slider value*/
    sliderText = document.querySelector("#slider-bar");
    sliderText.addEventListener("change", () => {
      fr = slider.value()
      console.log("slider value",fr);

      document.querySelector("#sliderCreate").innerHTML = `Frame Rate is: ${fr}`;
    })
    return;
  } else if (mode == "drawing") {
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
   
    currentBoard[x][y] = 1;
    fill("black");
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
  } else {
    return;
  }
}

//------------------------------------------------------------------------------------
function keyPressed() {
  
  if (mode !== "keyboard"){
    return
  } else {
    noLoop(); //Stop the loop() to draw the grip;
    gridDraw();
  }
  
  if (keyCode === LEFT_ARROW) {
    cursorX = (cursorX - 1 + columns) % columns;
    value = 60;
  } else if (keyCode === RIGHT_ARROW) {
    cursorX = (cursorX + 1 + columns) % columns;
    value = 60;
  } else if (keyCode === UP_ARROW) {
    cursorY = (cursorY - 1 + rows) % rows;
    value = 0;
  } else if (keyCode === DOWN_ARROW) {
    cursorY = (cursorY + 1 + rows) % rows;
    value = 0;
  } else if (keyCode === ENTER) {
    currentBoard[cursorX][cursorY] = 1;
  } else if (keyCode === ESCAPE) {
    loop();
    gridDraw();
  }

  fill(value);
  stroke(strokeColor);
  strokeWeight(1);
  rect(cursorX * unitLength, cursorY * unitLength, unitLength, unitLength);
}

//------------------------------------------------------------------------------------
//When mouse is pressed
function mousePressed() {


  if (
    // mouse within the drawing board
    mouseX > unitLength * columns ||
    mouseY > unitLength * rows ||
    mouseX < 0 ||
    mouseY < 0 
  ) {
    console.log("Your cursor is out!");
    return;
  } else {
    if (mode == "drawing") {
      if (pattern == "GosperGliderGunPattern") {
        GosperGliderGunDraw();
      } else if (pattern == "GliderPattern") {
        GliderDraw();
      } else if (pattern == "TrainPattern") {
        TrainDraw();
      } else if (pattern == "DragonPattern") {
        DragonDraw();
      } else {
        mouseDragged();
        gridDraw();
      }
      noLoop();
    }
  }
}

//------------------------------------------------------------------------------------
//When mouse is released
function mouseReleased() {
  if (
    mouseX < 0 ||
    mouseY < 0 ||
    mouseX > unitLength * columns ||
    mouseY > unitLength * rows
  ) {
    return;
  }
  loop();
}

//------------------------------------------------------------------------------------
/*Generate the pattern using the giving ArrayPattern*/
function initialPattern(pattern, xIndex, yIndex) {
  const processed = pattern.split("\n");

  let y = 0;
  let x = 0;
  for (let row of processed) {
    console.log(row);

    for (let entry of row) {
      if (entry == ".") {
        console.log(0);
        currentBoard[(xIndex + x + columns) % columns][
          (yIndex + y + rows) % rows
        ] = 0;
      } else {
        currentBoard[(xIndex + x + columns) % columns][
          (yIndex + y + rows) % rows
        ] = 1;
      }
      x++;
    }
    y++;
    x = 0;
  }
}

//------------------------------------------------------------------------------------
/*Pattern Generate Function*/
function GliderDraw() {
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);

  const GliderArr = `.O
..O
OOO`;

  initialPattern(GliderArr, x, y);
}

//------------------------------------------------------------------------------------
function DragonDraw() {
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);

  const DragonPattern = `............O
............OO..............O
..........O.OO.....O.O....OO
.....O...O...OOO..O....O
OO...O..O......O.O.....OOO..O
OO...O.OO......O...O.O.O
OO...O..........O.O.......OO
.....OO..............O......O
.......O............O.O
.......O............O.O
.....OO..............O......O
OO...O..........O.O.......OO
OO...O.OO......O...O.O.O
OO...O..O......O.O.....OOO..O
.....O...O...OOO..O....O
..........O.OO.....O.O....OO
............OO..............O
............O`;

  initialPattern(DragonPattern, x, y);
}

//------------------------------------------------------------------------------------
function GosperGliderGunDraw() {
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);

  const GosperGliderGunPattern = `........................O
......................O.O
............OO......OO............OO
...........O...O....OO............OO
OO........O.....O...OO
OO........O...O.OO....O.O
..........O.....O.......O
...........O...O
............OO`;

  initialPattern(GosperGliderGunPattern, x, y);
}

function TrainDraw() {
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);

  const TrainPattern = `.O..O
O
O...O
OOOO`;

  initialPattern(TrainPattern, x, y);
}
