const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight * 0.6;
}

const WIDTH_HEIGHT_RATIO = 9 / 7;

const EndLocations = {
    CORNERS: 1, // generate endpoints in top-left and bottom-right corners
    SMART_RANDOM: 2, // generate endpoints in random locations, but not too close to each other and on the edge of the maze only
    TRUE_RANDOM: 3, // generate endpoints in random locations, no restrictions
};

function initMaze(width, height, endLocations) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maze.init(width, height, endLocations);
}

function generateMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    maze.generate();
}

function solveMaze() {
    alert("Maze solving is not implemented yet.");
}

function showSettings() {
    const settings = document.getElementById("settings");
    if (settings.style.display === "none") {
        settings.style.display = "block";
    } else {
        settings.style.display = "none";
    }
}

function applySettings() {
    const cellCount = parseInt(document.getElementById("cellCount").value);
    let endLocations = parseInt(document.getElementById("endLocations").value);
    switch (endLocations) {
        case 1:
            endLocations = EndLocations.CORNERS;
            break;
        case 2:
            endLocations = EndLocations.SMART_RANDOM;
            break;
        case 3:
            endLocations = EndLocations.TRUE_RANDOM;
            break;
        default:
            endLocations = EndLocations.CORNERS;
    }
    const width = cellCount;
    const height = Math.ceil(cellCount / WIDTH_HEIGHT_RATIO);
    initMaze(width, height, endLocations);
}

function updateEndLocationsLabel() {
    const endLocations = parseInt(
        document.getElementById("endLocations").value
    );
    const label = document.getElementById("endLocationsLabel");
    switch (endLocations) {
        case EndLocations.CORNERS:
            label.innerText = "Corners";
            break;
        case EndLocations.SMART_RANDOM:
            label.innerText = "Smart Random";
            break;
        case EndLocations.TRUE_RANDOM:
            label.innerText = "True Random";
            break;
        default:
            label.innerText = "Corners";
    }
}

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.graph = new MazeGraph(width, height);
        this.path = [];
        this.tracingPath = false;
        this.cellSize = [0, 0]; // [width, height]
        this.endLocations = [EndLocations.CORNERS, [0, 0], [0, 0]]; // [type, [start], [end]]
        this.init(width, height, this.endLocations);
    }

    init(width, height, endLocations) {
        this.endLocations = [endLocations, [0, 0], [0, 0]];
        this.width = width;
        this.height = height;
        this.graph = new MazeGraph(width, height);
        const heightSum = canvas.height / (height * 10);
        const widthSum = canvas.width / (width * 10);
        this.cellSize = [widthSum * 10, heightSum * 10];
        for (let y = 0; y < canvas.height; y += heightSum) {
            ctx.strokeStyle = "#222";
            ctx.beginPath();
            ctx.moveTo(0, y * 10);
            ctx.lineTo(canvas.width * 10, y * 10);
            ctx.stroke();
        }

        for (let x = 0; x < canvas.width; x += widthSum) {
            ctx.strokeStyle = "#222";
            ctx.beginPath();
            ctx.moveTo(x * 10, 0);
            ctx.lineTo(x * 10, canvas.height * 10);
            ctx.stroke();
        }
        console.log(this.cellSize);
    }

    generate() {
        this.endLocations = this.graph.generateMaze(this.endLocations[0]);
        console.log("endLocations", this.endLocations);
        //console.log(this.graph.toGraphString());

        this.drawMaze();
    }

    clicked(x, y) {
        const cellX = Math.floor(x / this.cellSize[0]);
        const cellY = Math.floor(y / this.cellSize[1]);
        const node = this.graph.graph[cellY][cellX];
        if (node.isEnd) {
            if (this.path.length == 0) {
                if (this.tracingPath) {
                    this.tracingPath = false;
                } else {
                    this.tracingPath = true;
                }
            }
        } else {
            if (this.tracingPath) {
                // while (this.tracingPath) {
                //     this.drawMaze();
                //     ctx.strokeStyle = "#50dc5a";
                //     ctx.lineWidth = 3;
                //     ctx.beginPath();
                //     ctx.moveTo(
                //         node.x * this.cellSize[0] + this.cellSize[0] / 2,
                //         node.y * this.cellSize[1] + this.cellSize[1] / 2
                //     );
                //     ctx.lineTo(x, y);
                //     ctx.stroke();
                // }
            } else {
                this.tracingPath = false;
            }
        }
    }

    drawMaze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#222";

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (this.graph.graph[row][col].isEnd) {
                    ctx.fillStyle = "#50dc5a";
                    ctx.fillRect(
                        col * this.cellSize[0] + this.cellSize[0] * 0.25,
                        row * this.cellSize[1] + this.cellSize[1] * 0.25,
                        this.cellSize[0] * 0.5,
                        this.cellSize[1] * 0.5
                    );
                    ctx.strokeStyle = "#41b446";
                    ctx.lineWidth = 3;
                    ctx.strokeRect(
                        col * this.cellSize[0] + this.cellSize[0] * 0.25,
                        row * this.cellSize[1] + this.cellSize[1] * 0.25,
                        this.cellSize[0] * 0.5,
                        this.cellSize[1] * 0.5
                    );
                    ctx.strokeStyle = "#222";
                    ctx.lineWidth = 1;
                }
                const node = this.graph.graph[row][col];
                for (const neighbor of node.neighbors) {
                    if (!node.hasEdge(neighbor)) {
                        ctx.beginPath();
                        if (node.x < neighbor.x) {
                            ctx.moveTo(
                                col * this.cellSize[0] + this.cellSize[0],
                                row * this.cellSize[1]
                            );
                            ctx.lineTo(
                                col * this.cellSize[0] + this.cellSize[0],
                                row * this.cellSize[1] + this.cellSize[1]
                            );
                            ctx.stroke();
                        } else if (node.y < neighbor.y) {
                            ctx.moveTo(
                                col * this.cellSize[0],
                                row * this.cellSize[1] + this.cellSize[1]
                            );
                            ctx.lineTo(
                                col * this.cellSize[0] + this.cellSize[0],
                                row * this.cellSize[1] + this.cellSize[1]
                            );
                            ctx.stroke();
                        }
                    }
                }
            }
        }
    }
}

// resizeCanvas();
// window.addEventListener("resize", resizeCanvas);

const maze = new Maze(10, 8);
$("#mazeCanvas").click(function (event) {
    maze.clicked(event.offsetX, event.offsetY);
});
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
