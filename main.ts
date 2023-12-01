document.addEventListener("DOMContentLoaded", () => {
  const size = {
    h: 216,
    w: 384,
  }; //size of the game window
  let gameOver = false;
  const speed = 10;
  let score = 0;

  const canva = document.querySelector(".canva") as HTMLCanvasElement;
  canva.width = size.w;
  canva.height = size.h;
  const ctx = canva.getContext("2d");

  const button = document.querySelector(".btn") as HTMLElement;
  const scorePanel = document.querySelector(".score span") as HTMLElement;
  const hscore = document.querySelector(".hscore span") as HTMLElement;
  hscore.innerHTML = localStorage.getItem("score") ?? "";
  const over = document.querySelector(".gameover") as HTMLElement;
  scorePanel.innerHTML = score.toString();

  //random number generator between min and max
  const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  // for background anitmation and moving
  class Background {
    x = 0;
    y = 0;
    img: HTMLImageElement;
    top: HTMLImageElement;
    ground: HTMLImageElement;
    groundX = 0;
    speed = 1;
    groundSpeed = speed;
    constructor() {
      this.img = new Image();
      this.img.src = "./assets/bg.png";

      this.top = new Image();
      this.top.src = "./assets/plx-5.png";

      this.ground = new Image();
      this.ground.src = "./assets/ground.png";
    }

    //draw backgrounds
    draw() {
      ctx?.drawImage(this.img, 0, 0);
      ctx?.drawImage(this.top, this.x, 0);
      ctx?.drawImage(this.top, this.x + size.w, 0);
      ctx?.drawImage(this.ground, this.groundX, 0);
      ctx?.drawImage(this.ground, this.groundX + size.w, 0);
      this.update();
    }

    //move backgrounds
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

  //cactus animation and movement
  class Cactus {
    w = 20;
    h = 40;
    x = size.w;
    y = 0;
    speed = 0;
    img: HTMLImageElement;
    area: number[][];
    constructor() {
      this.w = 20;
      this.h = 40;
      this.x = size.w;
      this.y = size.h - this.h - 20;
      this.speed = speed;
      this.img = new Image();
      this.img.src = `./assets/cts${random(0, 2) == 0 ? "" : "2"}.png`;
      this.area = [
        [this.x, this.x + this.w - 5],
        [this.y, this.y + this.h],
      ];
    }
    //draw the cactus
    draw() {
      ctx?.drawImage(this.img, this.x, this.y, this.w, this.h);
      this.move();
    }
    // move the cactus 
    move() {
      this.x -= this.speed;
      this.area = [
        [this.x, this.x + this.w - 5],
        [this.y, this.y + this.h],
      ];
    }
  }

  //array of cactus 
  let objects: Cactus[] = [new Cactus()];

  //dino the main charactor
  class Dino {
    x = 50;
    y = 0;
    speed = 0;
    jumped = false;
    size = {
      w: 24,
      h: 24,
    };
    xoffset: number;
    yoffset: number;
    img: HTMLImageElement;
    g = 0.2;
    velocity = 0;
    ground = 0;
    frames = 0;
    constructor() {
      this.y = size.h - 50;
      this.xoffset = this.x + this.size.w;
      this.yoffset = this.y + this.size.h;
      this.img = new Image();
      this.img.src = `./assets/dino/Dino${random(1, 5)}.png`;
      this.ground = size.h - 50;
    }

    //draw the dino
    draw() {
      ctx?.drawImage(
        this.img,
        this.frames * this.size.w,
        0,
        this.size.w,
        this.size.h,
        this.x,
        this.y,
        this.size.w,
        this.size.h,
      );
    }
    //running animation
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

    //jumping handling 
    jump() {
      this.y += this.velocity;
      this.velocity += this.g;
      if (this.y >= this.ground) {
        this.y = this.ground;
        this.velocity = 0;
        this.jumped = false;
      }
    }

    //collide handling from cactus
    collide() {
      for (let i = 0; i < (objects.length > 1 ? 2 : 1); i++) {
        if (
          this.x < objects[i].area[0][1] &&
          this.xoffset > objects[i].area[0][0]
        ) {
          if (this.yoffset > objects[i].area[1][0]) {
            gameOver = true;
            const sound = new Audio("./sounds/hit.mp3");
            sound.play();
          }
        }
      }
    }
  }

  const dino = new Dino();
  const bg = new Background();
  //handling frames speed
  let frames = 0;
  const frameSkip = 5;
  let lastFrames = 0;
  let lastCactus = 10;

  dino.draw();
  bg.draw();

  //main animation loop
  const animate = () => {
    if (frames % frameSkip == 0) {
      ctx?.clearRect(0, 0, size.w, size.h);
      bg.draw();
      dino.draw();
      dino.running();
      for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
        if (objects[0].x < -objects[0].w) {
          objects = objects.slice(1, objects.length);
          i--;
          score += 5;
          scorePanel.innerHTML = score?.toString() ?? 0;
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
    if (score > (parseInt(localStorage.getItem("score") ?? "0") ?? 0)) {
      localStorage.setItem("score", score.toString());
    }
    hscore.innerHTML = localStorage.getItem("score") ?? "0";
    score = 0;
    scorePanel.innerHTML = score.toString();
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
      const ad = new Audio("./sounds/jump.mp3");
      ad.play();
    }
  });
});
