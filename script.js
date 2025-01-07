const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird object
const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 15,
    gravity: 0.6,
    velocity: 0,
    lift: -10
};

// Pipes and settings
const pipes = [];
const pipeGap = 120;
const pipeWidth = 50;
let score = 0;
let isGameOver = false;

// Load bird image
const birdImg = new Image();
birdImg.src = 'bird.png'; // Replace with the path to your bird image

// Game settings
function spawnPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomHeight: canvas.height - topHeight - pipeGap
    });
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameOver();
    }
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;

        // Check collision
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > canvas.height - pipe.bottomHeight)
        ) {
            gameOver();
        }

        // Check if the pipe is out of bounds
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }
    });

    // Spawn a new pipe
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        spawnPipe();
    }
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameOver() {
    isGameOver = true;
    ctx.font = '50px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvas.width / 2 - 130, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Press SPACE to restart', canvas.width / 2 - 110, canvas.height / 2 + 50);
}

function restartGame() {
    pipes.length = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    score = 0;
    isGameOver = false;
    spawnPipe();
    gameLoop();
}

document.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
        if (isGameOver) {
            restartGame();
        } else {
            bird.velocity = bird.lift;
        }
    }
});

function gameLoop() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawPipes();
        updateBird();
        updatePipes();
        drawScore();
        requestAnimationFrame(gameLoop);
    }
}

// Initialize the game
birdImg.onload = () => {
    spawnPipe();
    gameLoop();
};