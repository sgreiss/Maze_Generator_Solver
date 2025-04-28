class MazeGraph {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.graph = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => new Maze_Node(0, 0))
        );
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.graph[x][y].setPosition(x, y);
                if (x > 0) {
                    this.graph[x][y].addNeighbor(this.graph[x - 1][y]);
                }
                if (x < this.width - 1) {
                    this.graph[x][y].addNeighbor(this.graph[x + 1][y]);
                }
                if (y > 0) {
                    this.graph[x][y].addNeighbor(this.graph[x][y - 1]);
                }
                if (y < this.height - 1) {
                    this.graph[x][y].addNeighbor(this.graph[x][y + 1]);
                }
            }
        }
    }

    /*
            0  1  2  3
        0   .--.--.--.
            |        |
        1   .--.--.  .
            |        |
        2   .  .--.--.
            |        |
        3   .--.--.--.
    */

    toGraphString() {
        let str =
            "\t" + Array.from({ length: width }, (_, x) => x).join(" ") + "\n";
    }

    toPTString() {
        let str = "[\n";
        for (let row = 0; row < this.height; row++) {
            str += "[";
            for (let col = 0; col < this.width; col++) {
                str += this.graph[row][col].toString() + " ";
            }
            str += "]\n";
        }
        str += "]\n";
        return str;
    }
}

class MazeNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.edges = new Array();
        this.neighbors = new Array();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    addEdge(node) {
        this.edges.push(node);
    }

    hasEdge(node) {
        return this.edges.includes(node);
    }

    addNeighbor(node) {
        this.neighbors.push(node);
    }

    getEdges() {
        return this.edges;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
