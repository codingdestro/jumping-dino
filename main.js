document.addEventListener("DOMContentLoaded", () => {
  size = {
    h: 216,
    w: 384,
  }; //size of the game window
  gameOver = false;
  objects = [];
  speed = 10;
  score = 0;

  let canva = document.querySelector(".canva");
  canva.width = size.w;
  canva.height = size.h;
  let ctx = canva.getContext("2d");

  button = document.querySelector(".btn");
  scorePanel = document.querySelector(".score span");
  hscore = document.querySelector(".hscore span");
  hscore.innerHTML = localStorage.getItem("score");
  over = document.querySelector(".gameover");
  scorePanel.innerHTML = score;

  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  class Background {
    constructor() {
      this.x = 0;
      this.y = 0;
      this.img = new Image();
      this.img.src = "bg.png";
      this.top = new Image();
      this.top.src = "plx-5.png";
      this.ground = new Image();
      this.ground.src = "ground.png";
      this.groundX = 0;
      this.speed = 1;
      this.groundSpeed = speed;
    }
    draw() {
      ctx.drawImage(this.img, 0, 0);
      ctx.drawImage(this.top, this.x, 0);
      ctx.drawImage(this.top, this.x + size.w, 0);
      ctx.drawImage(this.ground, this.groundX, 0);
      ctx.drawImage(this.ground, this.groundX + size.w, 0);
      this.update();
    }
    update() {
      this.x -= this.speed;
      this.groundX -= this.groundSpeed;
      if (this.x < -size.w) {
        this.x = 0;
      }
      if (this.groundX < -size.w) {
        this.groundX = 0;
      }
    }
  }

  class Cactus {
    constructor() {
      this.w = 20;
      this.h = 40;
      this.x = size.w;
      this.y = size.h - this.h - 20;
      this.speed = speed;
      this.img = new Image();
      this.img.src = `cts${random(0, 2) == 0 ? "" : "2"}.png`;
      this.area = [
        [this.x, this.x + this.w - 5],
        [this.y, this.y + this.h],
      ];
    }
    draw() {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
      this.move();
    }
    move() {
      this.x -= this.speed;
      this.area = [
        [this.x, this.x + this.w - 5],
        [this.y, this.y + this.h],
      ];
    }
  }

  objects.push(new Cactus());

  class Dino {
    constructor() {
      this.x = 50;
      this.y = size.h - 50;
      this.speed = 0;
      this.jumped = false;
      this.size = {
        w: 24,
        h: 24,
      };
      this.xoffset = this.x + this.size.w;
      this.yoffset = this.y + this.size.h;
      this.img = new Image();
      this.img.src = `dino/Dino${random(1, 5)}.png`;
      this.frames = 0;
      this.g = 0.2;
      this.velocity = 0;
      this.ground = size.h - 50;
    }

    draw() {
      ctx.drawImage(
        this.img,
        this.frames * this.size.w,
        0,
        this.size.w,
        this.size.h,
        this.x,
        this.y,
        this.size.w,
        this.size.h
      );
    }
    running() {
      if (this.frames >= 10) {
        this.frames = 4;
      }
      if (this.jumped) {
        this.frames = 10;
      } else {
        this.frames++;
      }
      this.yoffset = this.y + this.size.h;
      this.collide();
    }
    jump() {
      this.y += this.velocity;
      this.velocity += this.g;
      if (this.y >= this.ground) {
        this.y = this.ground;
        this.velocity = 0;
        this.jumped = false;
      }
    }
    collide() {
      for (let i = 0; i < (objects.length > 1 ? 2 : 1); i++) {
        if (
          this.x < objects[i].area[0][1] &&
          this.xoffset > objects[i].area[0][0]
        ) {
          if (this.yoffset > objects[i].area[1][0]) {
            gameOver = true;
            let sound = new Audio("./sounds/hit.mp3");
            sound.play();
          }
        }
      }
    }
  }

  dino = new Dino();
  bg = new Background();
  //handling frames speed
  let frames = 0;
  let frameSkip = 5;
  let lastFrames = 0;
  let lastCactus = 10;

  dino.draw();
  bg.draw();

  //main animation loop
  const animate = () => {
    if (frames % frameSkip == 0) {
      ctx.clearRect(0, 0, size.w, size.h);
      bg.draw();
      dino.draw();
      dino.running();
      for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
        if (objects[0].x < -objects[0].w) {
          objects = objects.slice(1, objects.length);
          i--;
          score += 5;
          scorePanel.innerHTML = score;
        }
      }
      if (lastFrames >= lastCactus) {
        lastFrames = 0;
        objects.push(new Cactus());
        lastCactus = random(12, 30);
      }
      lastFrames++;
    }
    if (gameOver) {
      over.style.display = "block";
      button.style.display = "block";
      return true;
    }
    dino.jump();
    frames++;
    requestAnimationFrame(animate);
  };
  animate();

  button.addEventListener("click", () => {
    gameOver = false;
    objects = [];
    over.style.display = "none";
    button.style.display = "none";
    if (score > localStorage.getItem("score")) {
      localStorage.setItem("score", score);
    }
    hscore.innerHTML = localStorage.getItem("score");
    score = 0;
    scorePanel.innerHTML = score;
    lastFrames = 0;
    objects.push(new Cactus());
    animate();
  });
  // banner();
  window.addEventListener("dblclick", () => {});
  window.addEventListener("click", () => {
    if (!dino.jumped) {
      dino.velocity = -5;
      dino.jumped = true;
      let ad = new Audio("./sounds/jump.mp3");
      ad.play();
    }
  });
});