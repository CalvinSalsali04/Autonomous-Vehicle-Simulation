// Init input fields
$("#tp").val(50);
$("#b").val(100);
$("#ms").val(80);
$("#bc").val(0.5);
// Constants
let carLocation = [0,1];
let speed = 0;
let ped = false;
let spots= [[0,0],[3,10],[2,6],[35,40],[2,4]]
let peds = [[5,5],[10,10],[25,25]];
let battery = 100;
let maxbattery =100;
let batteryConsumption = 0.5;
let maxSpeed = 80;
let tirePressure = 10;
document.getElementById("entire-sim").style.display = "none";

let direction = [0,0];
const PADDING = 50;
const ROWS = 50;
const COLUMNS = 50;
const CELL_SIZE = 10;
const CELL_COLOR = '#222';
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const CANVAS_COLOR = '#e9e9e9';

const CELL_COUNT = ROWS * COLUMNS;
const COLORS = ['#222', '#a02121', '#e99f9f',"#c6e99f"];

let cells = new Array(CELL_COUNT).fill(0);


let canvas;

function setup() {
   canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
   canvas.parent('grid');
   background(CANVAS_COLOR);
   noStroke();

   fill(CELL_COLOR);
   for (let col=0;col<COLUMNS;col++) {
     for (let row=0;row<ROWS;row++) {
       let left = PADDING+(col*CELL_SIZE);
       let top = PADDING+(row*CELL_SIZE);
       let size = CELL_SIZE - 2;
       rect(left,top,size,size);
     }
   }

  
   renderCells();
}


function cellIndex(x, y) {
  return (y * COLUMNS) + x;
}

function renderCells() {
  let left = PADDING;
  let top = PADDING;
  let leftEnd = left + COLUMNS * CELL_SIZE;
  for (let i = 0; i < cells.length; i++) {
    fill(COLORS[cells[i]]);
    let size = CELL_SIZE - 2;
      rect(left, top, size, size);
  
  
    
    left += CELL_SIZE;
    if (left === leftEnd) {
      left = PADDING;
      top += CELL_SIZE;
    }
  }
}

let canMove = true;
// Car Location
function draw() {
  cells[cellIndex(carLocation[0],carLocation[1])] = 1;
  for (i=0; i<spots.length; i++) {
    cells[cellIndex(spots[i][0], spots[i][1])] = 2;
  }
  for (i=0; i<peds.length; i++) {
    cells[cellIndex(peds[i][0], peds[i][1])] = 3;
  }
  
  if (canMove && speed >= 1 && battery > 0) {
    console.log("canMove");
    move(direction[0],direction[1]);
    canMove = false;
    speedToSubtract = min(900,speed*50);
    setTimeout(() => {
      canMove = true;
    }, 1000-speedToSubtract);
  }
 
  
  renderCells();
}

function move(x,y) {
   cells[cellIndex(carLocation[0],carLocation[1])] = 0;


  if(carLocation[1] == 49 && y >= 1) {
    carLocation[1] = 0;
  } 
  else if(carLocation[1] == 0 && y <= -1) {
    carLocation[1] = 49;
  } else {
  carLocation[1] += y;
  }

console.log(x);
  if(carLocation[0] == 49 && x >= 1) {
    carLocation[0] = 0;
  } else if (carLocation[0] == 0 && x <= -1) {
    carLocation[0] = 49;
  } else {
    console.log("sdf");
  carLocation[0] += x;
  }

  if(x != 0 || y != 0 && battery > 0)  {

    battery -= batteryConsumption;
  }

  renderBattery();
  checkSpots();
 checkPeds();
 }
function adjSpeed(x) {
if (speed == 0 && x == -1) {
  speed += 0;
} else {
  speed += x;
}
  document.getElementById("speed").innerHTML = speed.toString();

}
function setDirection(dx,dy) {
  console.log(dx)
  direction = [dx,dy];
   renderDirStat();
}

function renderDirStat() {
  dx = direction[0];
  dy = direction[1];

  switch(dx) {
  case 1:
      // code block
    document.getElementById("facing").innerHTML = "East"
      break;
  case -1:
      // code block
     document.getElementById("facing").innerHTML = "West"
      break;

      // code block
  }
  switch(dy) {
  case 1:
      // code block
    document.getElementById("facing").innerHTML = "South"
      break;
  case -1:
      // code block
     document.getElementById("facing").innerHTML = "North"
      break;

      // code block
  }
}
function checkPeds() {
  ped = false;
  for (i=0; i< peds.length; i++) {
    horizD = Math.abs(peds[i][0] -carLocation[0])
    verticalD = Math.abs(peds[i][1] -carLocation[1])
    d = Math.sqrt(Math.pow(horizD,2) + Math.pow(verticalD,2));
    console.log(d)
    if (d < 6) {
      ped = true;
    }

  }
  console.log(ped);
   document.getElementById("ped").innerHTML = ped.toString();
}
function checkSpots() {
  numSpots = 0;
  for (i=0; i< spots.length; i++) {
    horizD = Math.abs(spots[i][0] -carLocation[0])
    verticalD = Math.abs(spots[i][1] -carLocation[1])
    d = Math.sqrt(Math.pow(horizD,2) + Math.pow(verticalD,2));
    console.log(d)
    if (d < 6) {
      numSpots++;
    }
      
  }
   document.getElementById("spots").innerHTML = numSpots.toString();
}

//colors
function setColor(color) {
  console.log(color);
  if (color == 0) {
    COLORS[1] = "#9f9fe9";
  } else {
    COLORS[1] = "#a02121";
  }
}

// start simulation

function start() {
  tirePressure = $("#tp").val();
  battery = $("#b").val();
  maxSpeed = $("#ms").val();
  batteryConsumption = $("#bc").val();
  maxBattery = $("#b").val();
  document.getElementById("entire-sim").style.display = "block";
  document.getElementById("config").style.display = "none";

  document.getElementById("carcolor").style.background = COLORS[1];
  $("#tpd").html(tirePressure);
  
  $("#battery").html(battery);
   $("#maxb").html(maxBattery);

  $("#maxspeed").html(maxSpeed);

  $("#btc").html(batteryConsumption);

  checkSpots();
  checkPeds();
}

function renderBattery() {
   $("#battery").html(battery);
  if (battery <= 0) {
    $("#batteryWarning").css("display", "block");
  }
}

 $("#batteryWarning").css("display", "none");