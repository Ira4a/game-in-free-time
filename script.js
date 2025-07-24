let myGamePiece;
let myObstacles = [];
let scoreDisplay;
let obstacleSpeed = 2; 

function startGame() {
  myGamePiece = new component(40, 40, "yellow", 40, 40);
  scoreDisplay = new component("20px", "Consolas", "black", 50, 30, "text");
  myGameArea.start();
}

const myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 700;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.firstChild);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);

    window.addEventListener('keydown', function(e) {
      myGameArea.keys = myGameArea.keys || [];
      myGameArea.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = false;
    });
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
    alert("Game over! Your score: " + this.frameNo);
  }
};

function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;

  this.update = function() {
    const ctx = myGameArea.context;
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText("Score: " + myGameArea.frameNo, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  };

  this.crashWith = function(other) {
    const myleft = this.x;
    const myright = this.x + this.width;
    const mytop = this.y;
    const mybottom = this.y + this.height;
    const otherleft = other.x;
    const otherright = other.x + other.width;
    const othertop = other.y;
    const otherbottom = other.y + other.height;
    return !(mybottom < othertop ||
             mytop > otherbottom ||
             myright < otherleft ||
             myleft > otherright);
  };
}

function everyinterval(n) {
  return (myGameArea.frameNo % n === 0);
}

function updateGameArea() {
  for (let i = 0; i < myObstacles.length; i++) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      myGameArea.stop();
      return;
    }
  }

  myGameArea.clear();
  myGameArea.frameNo += 1;

  if (everyinterval(200)) {
    obstacleSpeed += 0.2; 
  }

  if (myGameArea.frameNo === 1 || everyinterval(150)) {
    let x = myGameArea.canvas.width;
    let minHeight = 20;
    let maxHeight = 150;
    let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    let gap = Math.floor(Math.random() * 50 + 50);
    myObstacles.push(new component(10, height, "green", x, 0));
    myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
  }

  for (let i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x -= obstacleSpeed;
    myObstacles[i].update();
  }

  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX = -2; }
  if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX = 2; }
  if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY = -2; }
  if (myGameArea.keys && myGameArea.keys[40]) { myGamePiece.speedY = 2; }

  myGamePiece.newPos();
  myGamePiece.update();
  scoreDisplay.update();
}
