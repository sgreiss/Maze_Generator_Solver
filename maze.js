const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const WIDTH_HEIGHT_RATIO = 9 / 7;

function initMaze(width, height) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maze.init(width, height);
}

function generateMaze() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        this.paths = this.cellSize = [0, 0]; // [width, height]
        this.init(width, height);
    }

    init(width, height) {
        this.width = width;
        this.height = height;
        const height_sum = canvas.height / (height * 10);
        const width_sum = canvas.width / (width * 10);
        this.cellSize = [width_sum, height_sum];
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

    generate() {}
    draw() {}
}

const maze = new Maze(10, 8);

const graph = new MazeGraph(10, 8);
graph.generateMaze();
console.log(graph.toGraphString());

/*
ctx.strokeStyle = "#50dc5a";
    ctx.lineWidth = 3;

    const start = Math.floor(
      Math.random() * (2 * (this.width + this.height - 2))
    );
    let end = Math.floor(Math.random() * (2 * (this.width + this.height - 2)));
    let startX, startY, endX, endY;
    if (start < this.width) {
      end = Math.floor(
        Math.random() * (this.width + 2 * (this.height - 2)) + this.width
      );
      startX = start * this.cellSize[0] + this.cellSize[0] / 2;
      startY = cellSize[2] / 2;
    } else if (start >= this.width && start < this.width + this.height - 2) {
      while (end >= this.width && end < this.width + this.height - 2) {
        end = Math.floor(Math.random() * (2 * this.width + this.height - 2));
      }
      startX = this.cellSize[0] / 2;
      startY =
        (start - this.width + 1) * this.cellSize[2] + this.cellSize[2] / 2;
    } else if (
      start >= this.width + this.height - 2 &&
      start < this.width + 2 * (this.height - 2)
    ) {
      while (
        end >= this.width + this.height - 2 &&
        end < this.width + 2 * (this.height - 2)
      ) {
        end = Math.floor(Math.random() * (2 * this.width + this.height - 2));
      }
    } else {
      end = Math.floor(Math.random() * (this.width + 2 * (this.height - 2)));
      startX =
        (start - this.width - 2 * (this.height - 2)) * this.cellSize[0] +
        this.cellSize[0] / 2;
      startY = this.height * this.cellSize[2] - this.cellSize[2] / 2;
    }
*/
