function removeFromArray (arr, elt) {
  for (var i =arr.length-1; i>=0; i-- ){
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}


function heuristic(a,b){
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}


var cols = 30;
var rows = 30;
var grid = new Array(cols);

var openSet = []; 
var closedSet = []; 


var start;
var end;


var w, h;


var path = [];



function Spot (i,j) {

  this.isStart = false;
  this.isEnd = false;

  this.show = function() {
    if (this.isStart || this.isEnd) {
      fill(0, 255, 0); 
    } else if (this.wall) {
      fill(0); 
    } else {
      fill(255); 
    }
    stroke(0);
    rect(this.i * w, this.j * h, w, h);
  };


  this.i = i;
  this.j = j;


  this.f = 0;
  this.g = 0;
  this.h = 0;


  this.neighbors = [];


  this.previous = undefined;


  this.wall = false;
  if (random(1) < 0.2){
    this.wall = true;
  }




  this.addNeighbors = function(grid) {
    var i = this.i;
    var j = this.j;
    if ( i< cols-1) {
      this.neighbors.push(grid[i+1][j]);
    }

    if (i > 0){
      this.neighbors.push(grid[i-1][j]);
    }

    if (j < rows-1){
      this.neighbors.push(grid[i][j+1]);
    }

    if (j >0){
      this.neighbors.push(grid[i][j-1]);
    }

    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i-1][j-1]);
    }

    if (i < cols -1 && j > 0) {
      this.neighbors.push(grid[i+1][j-1]);
    }

    if (i > 0 && j < rows -1) {
      this.neighbors.push(grid[i-1][j+1]);
    }

    if (i < cols-1 && j < rows -1) {
      this.neighbors.push(grid[i+1][j+1]);
    }
  }

}

var mode = 0;
var calculatePath = false;

function setup() {
  var calculateButton = createButton('Calculate Path');
  calculateButton.mousePressed(startPathFinding);



  var cellSize = 20;
  var canvasWidth = cols* cellSize;
  var canvasHeight = rows* cellSize;

  createCanvas(canvasWidth, canvasHeight);
  console.log('A*')

   w = cellSize;
   h = cellSize;


  for (var i= 0; i< cols; i++){
    grid[i] = new Array(rows);
    for (var j = 0 ; j< rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }


  for (var i= 0; i< cols; i++){
    for (var j = 0 ; j< rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }


  start = grid[0][0];
  end = grid [cols-1][rows-1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);



}

function findPath(){


  while (openSet.length > 0) {
    var lowestIndex = 0;

    for (var i = 0; i<openSet.length; i++){
      if (openSet[i].f < openSet[lowestIndex].f){
        lowestIndex = i; 
      }
    }

    var current = openSet[lowestIndex];

    if (current === end) {
      path = [];
      var temp = current;
      path.push(temp);
      while( temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
      }
      return;   
    }


    removeFromArray(openSet, current);
    closedSet.push(current);


    var neighbors = current.neighbors;
    for (var i=0; i<neighbors.length;i++){
      var neighbor = neighbors[i];


      if (!closedSet.includes(neighbor) && !neighbor.wall){
        var tempG = current.g + 1;

        var newPath = false;
        if (openSet.includes(neighbor)){
          if (tempG < neighbor.g){
            neighbor.g = tempG;
            newPath = true;
          }
        } else{
          neighbor.g = tempG;
          newPath= true;
          openSet.push(neighbor);
        }

        if (newPath){
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }



      }


    }

  } 

  var totalEnergy = path.length * 1000;

}

function mousePressed() {
  var i = floor(mouseX / w);
  var j = floor(mouseY / h);
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    if (mode == 0) {
      if (start) start.isStart = false;
      start = grid[i][j];
      start.isStart = true;
      start.wall = false;
      openSet = [start]; 
      calculatePath = false;
      path = []; 
      mode = 1;
    } else {
      if (end) end.isEnd = false;
      end = grid[i][j];
      end.isEnd = true;
      end.wall = false;
      mode = 0;
    }
  }
}


function startPathFinding (){
  if (!calculatePath && start && end){
    calculatePath = true;
    findPath();
  }
}

function resetPath() {
  openSet = [];
  closedSet = [];
  path = [];
  calculatePath = false;

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
      grid[i][j].addNeighbors(grid);
      grid[i][j].isStart = false;
      grid[i][j].isEnd = false;
    }
  }

  start = null;
  end  = null;
  mode = 0;
}


function draw() {


  background(255);



  for (var i=0;i < cols; i++ ) {
    for (var j = 0; j < rows; j++){
      grid[i][j].show();
    }
  }



  if (calculatePath && path.length > 0) {
    fill(255, 0, 0); 
    noStroke(); 
    for (var i = 0; i < path.length; i++) {
      rect(path[i].i * w, path[i].j * h, w, h); 
    }
  }

  if (calculatePath) {
    var totalEnergy = path.length * 1000;
    document.getElementById('totalEnergy').innerHTML = "Total Energy Consumption: " + totalEnergy + " watts";
  }



}

