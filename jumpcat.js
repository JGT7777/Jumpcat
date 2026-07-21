const canvas = document.getElementById("game");



const ctx = canvas.getContext("2d");

const catImg = new Image();
catImg.src = "cat/cat13.png";


const CAT_W = 80;

const CAT_H = 90;


const PIPE_W = 120;
const GAP = 220; 

let catY = canvas.height / 2;
let velY = 0;

const gravity = 0.25;   



let pipes = [];
let speed = 3; 
let score = 0;
let gameOver = false;

const DISTANCE = 340; 


document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    if (!gameOver) {


      velY = -6; 
    } else {
      resetGame();
    }
  }
});

function resetGame() {
  catY = canvas.height / 2;
  velY = 0;
  pipes = [];
  score = 0;

  gameOver = false;
}


function spawnPipe() {
  const minTop = 50;
  const maxTop = canvas.height - GAP - 50;

  const topHeight = Math.random() * (maxTop - minTop) + minTop;

  pipes.push({
    x: canvas.width + 50,
    topY: 0,
    topH: topHeight,
    bottomY: topHeight + GAP,
    bottomH: canvas.height - (topHeight + GAP)
  });
}

function update() {
  if (gameOver) return;

  

  velY += gravity;
  catY += velY;

  
  if (catY < 0) {
    catY = 0;
    velY = 0;
  }
  if (catY > canvas.height - CAT_H) {
    catY = canvas.height - CAT_H;
    velY = 0;
  }

  
  if (
    pipes.length === 0 ||
    pipes[pipes.length - 1].x < canvas.width - DISTANCE
  ) {
    spawnPipe();
  }

  
  pipes.forEach(p => {
    p.x -= speed;

    const catBox = {
      x: 150,
      y: catY,
      w: CAT_W,
      h: CAT_H
    };

    const topBox = {
      x: p.x,
      y: p.topY,
      w: PIPE_W,
      h: p.topH
    };

    const bottomBox = {
      x: p.x,
      y: p.bottomY,
      w: PIPE_W,
      h: p.bottomH
    };

    const collideTop =
      catBox.x < topBox.x + topBox.w &&
      catBox.x + catBox.w > topBox.x &&
      catBox.y < topBox.y + topBox.h;

    const collideBottom =
      catBox.x < bottomBox.x + bottomBox.w &&
      catBox.x + catBox.w > bottomBox.x &&
      catBox.y + catBox.h > bottomBox.y;

    if (collideTop || collideBottom) {
      gameOver = true;
    }
  });

  pipes = pipes.filter(p => p.x > -200);

  score += 0.1;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  ctx.drawImage(catImg, 150, catY, CAT_W, CAT_H);

  
  pipes.forEach(p => {
    
    ctx.fillStyle = "#008000";
    ctx.fillRect(p.x, p.topY, PIPE_W, p.topH);

    
    ctx.fillStyle = "#008000";
    ctx.fillRect(p.x, p.bottomY, PIPE_W, p.bottomH);
  });




  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + Math.floor(score), 20, 40);

  if (gameOver) {
    ctx.fillStyle = "#2f00ff";
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2 - 20);
    ctx.font = "26px Arial";
    ctx.fillText(" Press SPACE to RESTART", canvas.width / 2 - 190, canvas.height / 2 + 20);
  }
}




function loop() {
  
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
