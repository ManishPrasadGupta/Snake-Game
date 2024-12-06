console.log("Let The Game Begin!");

let snake = [{ top: 200, left: 200 }];
let direction = { key: "ArrowRight", dx: 20, dy: 0 };
let food = null;
let score = 0;
let highScore = 0;
let speed = 100;
let gameInterval;
let userName = "";

// Array to store leaderboard data
let leaderboard = [];

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('resetButton').addEventListener('click', resetGame);

function startGame() {
    userName = document.getElementById('userName').value.trim();

    if (!userName) {
        alert("Please enter your name before starting the game.");
        return;
    }

    document.getElementById('start-screen').style.display = 'none'; // Hide the start screen

    console.log(`Game started for ${userName}!`);
    randomFood();
    drawSnake();
    drawFood();
    gameInterval = setInterval(gameLoop, speed);
}

function resetGame() {
    clearInterval(gameInterval);
    if (score > highScore) {
        highScore = score;
        updateLeaderboard();
    }
    score = 0;
    speed = 100;
    snake = [{ top: 200, left: 200 }];
    direction = { key: "ArrowRight", dx: 20, dy: 0 };
    food = null;
    randomFood();
    updateScore();
    // drawSnake();
    // drawFood();
    document.getElementById('start-screen').style.display = 'block'; // Show the start screen
    displayLeaderboard(); // Display leaderboard after each game
}

function updateLeaderboard() {
    // Add the player's data to the leaderboard array
    leaderboard.push({ name: userName, score: score });
    // Sort the leaderboard based on scores in descending order
    leaderboard.sort((a, b) => b.score - a.score);
    // Update the leaderboard display
    displayLeaderboard();
}

function displayLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard-container');
    leaderboardContainer.innerHTML = ''; // Clear previous entries

    const leaderboardTitle = document.createElement('h2');
    leaderboardTitle.innerText = 'Leaderboard';
    leaderboardContainer.appendChild(leaderboardTitle);

    leaderboard.forEach((player, index) => {
        const playerEntry = document.createElement('div');
        playerEntry.innerHTML = `${index + 1}. ${player.name}: ${player.score}`;
        leaderboardContainer.appendChild(playerEntry);
    });

    leaderboardContainer.style.display = 'block'; // Show the leaderboard container
}

// Rest of your existing code...

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("high-score").innerText = "High Score: " + highScore;
}

function gameLoop() {
    if (gameOver()) {
        alert("Game over!");
        clearInterval(gameInterval);
        resetGame();
    }

    document.getElementById("game-board").innerHTML = "";
    moveSnake();
    if (!food) {
        randomFood();
        score += 2;
        speed = speed - 2;
    }
    if (eatFood()) {
        document.getElementById("score").innerHTML = `Score :${score}`;
    }
    updateScore();
    drawSnake();
    drawFood();
}

// Rest of your existing code...


window.addEventListener("keydown", (e) => {
    const newDirection = getDirection(e.key);
    console.log("Key I have Pressed", e.key);
    const allowedChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
    if (allowedChange) direction = newDirection;
});

function getDirection(key) {
  switch (key) {
      case "ArrowUp":
      case "w":
          return { key, dx: 0, dy: -20 };
      case "ArrowDown":
      case "s":
          return { key, dx: 0, dy: 20 };
      case "ArrowLeft":
      case "a":
          return { key, dx: -20, dy: 0 };
      case "ArrowRight":
      case "d":
          return { key, dx: 20, dy: 0 };
      default:
          return direction;
  }
}


function moveSnake() {
    const head = Object.assign({}, snake[0]);
    head.top += direction.dy;
    head.left += direction.dx;
    snake.unshift(head);

    if (snake[0].top < 0) snake[0].top = 380;
    if (snake[0].left < 0) snake[0].left = 380;
    if (snake[0].top > 380) snake[0].top = 0;
    if (snake[0].left > 380) snake[0].left = 0;

    if (!eatFood()) snake.pop();
}

function randomFood() {
    food = {
        top: Math.floor(Math.random() * 20) * 20,
        left: Math.floor(Math.random() * 20) * 20,
    };
}

function eatFood() {
    if (snake[0].top === food.top && snake[0].left === food.left) {
        food = null;
        return true;
    }
    return false;
}

function gameOver() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].top === snake[0].top && snake[i].left === snake[0].left)
            return true;
    }
    return false;
}


function drawSnake() {
    snake.forEach((item, index) => {
        const snakeElement = document.createElement("div");
        snakeElement.style.top = `${item.top}px`;
        snakeElement.style.left = `${item.left}px`;
        snakeElement.classList.add("snake");
        if (index === 0) snakeElement.classList.add("head");
        if (index === snake.length - 1) snakeElement.classList.add("head");
        document.getElementById("game-board").appendChild(snakeElement);
    });
}

function drawFood() {
    const foodElement = document.createElement("div");
    foodElement.style.top = `${food.top}px`;
    foodElement.style.left = `${food.left}px`;
    foodElement.classList.add("food");
    document.getElementById("game-board").appendChild(foodElement);
}
