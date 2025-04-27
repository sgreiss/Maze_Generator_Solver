const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const WIDTH_HEIGHT_RATIO = 9/7;

function initMaze(width, height) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  maze.init(width, height);
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
  const cellSize = parseInt(document.getElementById("cellSize").value);
  const width = cellSize;
  const height = Math.ceil(cellSize / WIDTH_HEIGHT_RATIO);
  initMaze(width, height);
}

class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, () => Array(width).fill(0));
    this.init(width, height);
  }

  init(width, height) {
    const height_sum = canvas.height / (height * 10);
    const width_sum = canvas.width / (width * 10);
    for (let y = 0; y < canvas.height; y += height_sum) {
      ctx.strokeStyle = "#222";
      ctx.beginPath();
      ctx.moveTo(0, y * 10);
      ctx.lineTo(canvas.width * 10, y * 10);
      ctx.stroke();
    }

    for (let x = 0; x < canvas.width; x += width_sum) {
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

const maze = new Maze(25, 20);
