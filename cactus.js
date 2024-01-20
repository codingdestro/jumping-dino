import { loadImages, random } from "./utils.js";

const cactusImages = [];
cactusImages.push(loadImages("./assets/cts.png"));
cactusImages.push(loadImages("./assets/cts2.png"));

export default class Cactus {
  constructor(ctx, speed, size) {
    this.w = 20;
    this.h = 40;
    this.x = size.w;
    this.y = 0;
    this.speed = 0;
    this.w = 20;
    this.h = 40;
    this.x = size.w;
    this.y = size.h - this.h - 20;
    this.speed = speed;
    this.img = cactusImages[random(0, 2) == 0 ? 0 : 1];
    this.ctx = ctx;
    this.area = [
      [this.x, this.x + this.w - 3],
      [this.y, this.y + this.h],
    ];
  }
  //draw the cactus
  draw() {
    this.ctx.fillRect(this.x, this.y, this.w - 3, this.h);
    this.ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
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
