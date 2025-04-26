const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

function generateMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, 100, 100); // Temporary example: replace with maze logic
}

function solveMaze() {
    ctx.strokeStyle = 'lime';
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(110, 110); // Temporary example: replace with solver logic
    ctx.stroke();
}
