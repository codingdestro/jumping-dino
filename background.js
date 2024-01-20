import { loadImages } from "./utils.js";
export default class Background {
  constructor(ctx, speed, size) {
    this.x = 0;
    this.y = 0;
    this.size = size;
    this.groundX = 0;
    this.speed = 1;
    this.groundSpeed = speed;
    this.img = loadImages("./assets/bg.png");
    this.top = loadImages("./assets/plx-5.png");
    this.ground = loadImages("./assets/ground.png");
    this.ctx = ctx;
  }
  //draw backgrounds
  draw() {
    this.ctx.drawImage(this.img, 0, 0);
    this.ctx.drawImage(this.top, this.x, 0);
    this.ctx.drawImage(this.top, this.x + this.size.w, 0);
    this.ctx.drawImage(this.ground, this.groundX, 0);
    this.ctx.drawImage(this.ground, this.groundX + this.size.w, 0);
    this.update();
  }
  //move backgrounds
  update() {
    this.x -= this.speed;
    this.groundX -= this.groundSpeed;
    if (this.x < -this.size.w) {
      this.x = 0;
    }
    if (this.groundX < -this.size.w) {
      this.groundX = 0;
    }
  }
}
