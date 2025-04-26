const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

function initMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  maze.init();
}

function generateMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  maze.generate();
}

function solveMaze() {}

function showSettings() {
  const settings = document.getElementById("settings");
  if (settings.style.display === "none") {
    settings.style.display = "block";
  } else {
    settings.style.display = "none";
  }
}

function applySettings() {
  width = parseInt(document.getElementById("width").value);
  height = parseInt(document.getElementById("height").value);
  initMaze();
}

class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, () => Array(width).fill(0));
    this.init();
  }

  init() {
    for (let y = 0; y < canvas.height; y++) {
      ctx.strokeStyle = "#222";
      ctx.beginPath();
      ctx.moveTo(0, y * 10);
      ctx.lineTo(canvas.width * 10, y * 10);
      ctx.stroke();
    }
    for (let x = 0; x < canvas.width; x++) {
      ctx.strokeStyle = "#222";
      ctx.beginPath();
      ctx.moveTo(x * 10, 0);
      ctx.lineTo(x * 10, canvas.height * 10);
      ctx.stroke();
    }
  }

  generate() {
    this.draw();
  }

  draw() {}
}

let width = 90,
  height = 70;

const maze = new Maze(width, height);
