class Maze_Graph {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.graph = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => new Maze_Node(0, 0))
        );
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                this.graph[row * width + col].setPosition(col, row);
            }
        }
    }
}

class Maze_Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.edges = new Array();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    addEdge(node) {
        this.edges.push(node);
    }

    getEdges() {
        return this.edges;
    }
}
