let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;
let vitesse = 5;
let dx = vitesse;
let dy = -vitesse;
let ballSize = 20;
let bille = new Image();
bille.src = "./../images/ball.webp";
let platforme = new Image();
platforme.src = "./../images/paddle.webp";
let ballRadius = 10;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let brickRowCount = 6;
let brickColumnCount = 7;
let brickWidth = 80;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let numberOfTries = 5;
let animationId = null;
let myMusic = document.querySelector("audio");

let rightPressed = false;
let leftPressed = false;

const gameStart = document.getElementById("game-intro");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("restart-button");
const showConvas = document.getElementById("myCanvas");

let bricks = [];

startButton.addEventListener("click", () => {
  createBricks();
  draw();
  gameStart.style.display = "none";
  showConvas.style.display = "block";
});

resetButton.addEventListener("click", () => {
  createBricks();
  numberOfTries = 5;
  score = 0;
  draw();
  gameStart.style.display = "none";
  resetButton.style.display = "none";
});

function createBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, color: randColor() };
    }
  }
}

function drawBall() {
  ctx.drawImage(bille, x, y, ballSize, ballSize);
}

function drawPaddle() {
  ctx.drawImage(
    platforme,
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight
  );
}

const randColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase()
  );
};

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
    if (score > 15 && vitesse === 5) {
        vitesse *= 1.5;
        dx *= 1.5;
        dy *= 1.5;
    }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  collisionDetection();
  drawTries();
  myMusic.play();

  x += dx;
  y += dy;

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      numberOfTries--;
      if (numberOfTries <= 0) {
        drawTries();
        alert("GAME OVER");
        resetButton.style.display = "inline";
        cancelAnimationFrame(animationId);
        return;
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = vitesse;
        dy = -vitesse;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX += 5;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 5;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  animationId = requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("You Win!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Fantasy";
  ctx.fillStyle = "#987456";
  ctx.fillText("Score : " + score, 8, 20);
}

function drawTries() {
  ctx.font = "16px Fantasy";
  ctx.fillStyle = "#39ff14";
  ctx.fillText("Tries : " + numberOfTries, canvas.width - 65, 20);
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}
