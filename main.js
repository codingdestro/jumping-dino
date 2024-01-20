"use strict";
import Background from "./background.js";
import { random } from "./utils.js";
import Cactus from "./cactus.js";
import Dino from "./dino.js";
let imageStack = [];

const size = {
  h: 216,
  w: 384,
}; //size of the game window

let gameOver = false;
const speed = 10;
let score = 0;
const canva = document.querySelector(".canva");
canva.width = size.w;
canva.height = size.h;
const ctx = canva.getContext("2d");
const startButton = document.querySelector(".btn");
const scorePanel = document.querySelector(".score span");
const hscore = document.querySelector(".hscore span");
let _a;
hscore.innerHTML =
  (_a = localStorage.getItem("score")) !== null && _a !== void 0 ? _a : "";
const over = document.querySelector(".gameover");

const container = document.querySelector(".container");
scorePanel.innerHTML = score.toString();

//creating the background
const bg = new Background(ctx, speed, size);

//dino the main charactor
const dino = new Dino(ctx, size);

//array of cactus
let objects = [new Cactus(ctx, speed, size)];

//handling frames speed
let frames = 0;
const frameSkip = 5;
let lastFrames = 0;
let lastCactus = 10;

dino.draw();
bg.draw();
let requestFrame;
//main animation loop
const animate = () => {
  var _a;
  if (frames % frameSkip == 0) {
    ctx.clearRect(0, 0, size.w, size.h);
    bg.draw();
    dino.draw();

    //drawing all objects
    for (let i = 0; i < objects.length; i++) {
      objects[i].draw();
      if (objects[0].x < -objects[0].w) {
        objects = objects.slice(1, objects.length);
        i--;
        score += 5;
        //displaying the score
        scorePanel.innerHTML =
          (_a =
            score === null || score === void 0 ? void 0 : score.toString()) !==
            null && _a !== void 0
            ? _a
            : 0;
      }
    }
    if (lastFrames >= lastCactus) {
      lastFrames = 0;
      objects.push(new Cactus(ctx, speed, size));
      lastCactus = random(12, 30);
    }
    lastFrames++;
  }

  gameOver = dino.running(objects);
  if (gameOver) {
    over.style.display = "block";
    startButton.style.display = "block";
    cancelAnimationFrame(requestFrame);
    return true
  }
  dino.jump();
  frames++;
  requestFrame = requestAnimationFrame(animate);
};
//   animate();

startButton.addEventListener("click", () => {
  var _a, _b, _c;
  gameOver = false;
  objects = [];
  over.style.display = "none";
  startButton.style.display = "none";
  if (
    score >
    ((_b = parseInt(
      (_a = localStorage.getItem("score")) !== null && _a !== void 0 ? _a : "0"
    )) !== null && _b !== void 0
      ? _b
      : 0)
  ) {
    localStorage.setItem("score", score.toString());
  }
  hscore.innerHTML =
    (_c = localStorage.getItem("score")) !== null && _c !== void 0 ? _c : "0";
  score = 0;
  scorePanel.innerHTML = score.toString();
  lastFrames = 0;
  objects.push(new Cactus(ctx,speed,size));
  animate();
});
// banner();
container.addEventListener("click", () => {
  if (!dino.jumped) {
    dino.velocity = -5;
    dino.jumped = true;
    const ad = new Audio("./sounds/jump.mp3");
    ad.play();
  }
});
const interval = setInterval(() => {
  console.log("loading ...");
  if (imageStack.length === 0) {
    clearInterval(interval);
    startButton.style.display = 'block'
  }
}, 100);
