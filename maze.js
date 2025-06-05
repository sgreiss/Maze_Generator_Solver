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
        this.path = [];
        console.log("endLocations", this.endLocations);
        //console.log(this.graph.toGraphString());

        this.drawMaze();
    }

    interact(dragStart, dragEnd, event) {
        const startCell = [Math.floor(dragStart[1] / this.cellSize[1]), Math.floor(dragStart[0] / this.cellSize[0])];
        const endCell = [Math.floor(dragEnd[1] / this.cellSize[1]), Math.floor(dragEnd[0] / this.cellSize[0])];
        const startNode = this.graph.graph[startCell[0]][startCell[1]];
        const endNode = this.graph.graph[endCell[0]][endCell[1]];

        if ((startNode.isEnd || startNode.isPath) && event === "mousedown") {
            console.log("Clicked on end cell:", startCell);
            this.tracingPath = true;
        } else {
            if (event === "mousemove" && this.tracingPath) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.drawMaze();
                ctx.strokeStyle = "#50dc5a";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(
                    startCell[1] * this.cellSize[0] + this.cellSize[0] / 2,
                    startCell[0] * this.cellSize[1] + this.cellSize[1] / 2
                );
                ctx.lineTo(
                    endCell[1] * this.cellSize[0] + this.cellSize[0] / 2,
                    endCell[0] * this.cellSize[1] + this.cellSize[1] / 2
                );
                ctx.stroke();
                if (endNode.isPath != true) {
                    this.path.push([startCell, endCell]);
                    endNode.isPath = true;
                }
            } else if (event === "mouseup") {
                this.tracingPath = false;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.drawMaze();
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

        for (const [start, end] of this.path) {
            ctx.strokeStyle = "#50dc5a";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(
                start[1] * this.cellSize[0] + this.cellSize[0] / 2,
                start[0] * this.cellSize[1] + this.cellSize[1] / 2
            );
            ctx.lineTo(
                end[1] * this.cellSize[0] + this.cellSize[0] / 2,
                end[0] * this.cellSize[1] + this.cellSize[1] / 2
            );
            ctx.stroke();
            
            if (!this.graph.graph[end[0]][end[1]].isEnd) {
                ctx.fillStyle = "#50dc5a";
                ctx.fillRect(
                    end[1] * this.cellSize[0] + this.cellSize[0] * 0.375,
                    end[0] * this.cellSize[1] + this.cellSize[1] * 0.375,
                    this.cellSize[0] * 0.25,
                    this.cellSize[1] * 0.25
                );
                ctx.strokeStyle = "#41b446";
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    end[1] * this.cellSize[0] + this.cellSize[0] * 0.375,
                    end[0] * this.cellSize[1] + this.cellSize[1] * 0.375,
                    this.cellSize[0] * 0.25,
                    this.cellSize[1] * 0.25
                );
                ctx.strokeStyle = "#222";
                ctx.lineWidth = 1;
            }
        }
    }
}

//TODO:
// resizeCanvas();
// window.addEventListener("resize", resizeCanvas);

const maze = new Maze(10, 8);

var dragging = false;
var dragStart = [0, 0];
var dragEnd = [0, 0];
var mousein = true;

canvas.addEventListener("mouseenter", function (event) {
    mousein = true;
});
canvas.addEventListener("mouseleave", function (event) {
    mousein = false;
});

canvas.addEventListener("mousedown", function (event) {
    if (!mousein) return;
    dragging = true;
    dragStart[0] = event.offsetX;
    dragStart[1] = event.offsetY;
    maze.interact(dragStart, dragEnd, event.type);
});
canvas.addEventListener("mousemove", function (event) {
    if (!mousein) return;
    if (dragging) {
        if (maze.graph.graph[Math.floor(dragStart[1] / maze.cellSize[1])][Math.floor(dragStart[0] / maze.cellSize[0])].isPath) {
            dragStart = dragEnd.slice(); // Update dragStart to the current dragEnd position
        }
        dragEnd[0] = event.offsetX;
        dragEnd[1] = event.offsetY;
        maze.interact(dragStart, dragEnd, event.type);
    }
});
canvas.addEventListener("mouseup", function (event) {
    if (!mousein) return;
    dragging = false;
    dragEnd[0] = event.offsetX;
    dragEnd[1] = event.offsetY;
    maze.interact(dragStart, dragEnd, event.type);
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
