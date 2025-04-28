class MazeGraph {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.graph = Array.from({ length: height }, () =>
            Array.from({ length: width }, () => new MazeNode(0, 0))
        );
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                this.graph[row][col].setPosition(col, row);
                if (col > 0) {
                    this.graph[row][col].addNeighbor(this.graph[row][col - 1]);
                }
                if (col < this.width - 1) {
                    this.graph[row][col].addNeighbor(this.graph[row][col + 1]);
                }
                if (row > 0) {
                    this.graph[row][col].addNeighbor(this.graph[row - 1][col]);
                }
                if (row < this.height - 1) {
                    this.graph[row][col].addNeighbor(this.graph[row + 1][col]);
                }
            }
        }
    }

    generateMaze() {
        const start =
            this.graph[Math.floor(Math.random() * this.height)][
                Math.floor(Math.random() * this.width)
            ];
        const stack = [start];
        const visited = new Set([start]);
        while (stack.length > 0) {
            const current = stack.pop();
            const neighbors = current.neighbors.filter(
                (neighbor) => !visited.has(neighbor)
            );
            if (neighbors.length > 0) {
                stack.push(current);
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                current.addEdge(next);
                next.addEdge(current);
                visited.add(next);
                stack.push(next);
            }
        }
    }

    toGraphString() {
        let str =
            "\t" +
            Array.from({ length: this.width }, (_, x) => x).join("  ") +
            "\n"; // 0  1  2  3  ...
        str += Array.from(
            { length: this.height },
            (_, row) =>
                row +
                "   " +
                Array.from(
                    { length: this.width },
                    (_, col) =>
                        "." +
                        (col + 1 < this.width &&
                        this.graph[row][col].hasEdge(this.graph[row][col + 1])
                            ? "--"
                            : "  ")
                ).join("") +
                "\n\t" +
                Array.from(
                    { length: this.width },
                    (_, col) =>
                        (row + 1 < this.height &&
                        this.graph[row][col].hasEdge(this.graph[row + 1][col])
                            ? "|"
                            : " ") + "  "
                ).join("")
        ).join("\n");

        return str + "\n";
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

    hasNoEdges() {
        return this.edges.length === 0;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
