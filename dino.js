import { random, loadImages } from "./utils.js";
export default class Dino {
  constructor(ctx, size) {
    this.x = 50;
    this.y = 0;
    this.speed = 0;
    this.jumped = false;
    this.size = {
      w: 24,
      h: 24,
    };
    this.g = 0.2;
    this.velocity = 0;
    this.ground = 0;
    this.frames = 0;
    this.y = size.h - 50;
    this.xoffset = this.x + this.size.w - 10;
    this.yoffset = this.y + this.size.h;
    this.img = loadImages(`./dino/Dino${random(1, 5)}.png`);
    this.ground = size.h - 50;
    this.ctx = ctx;
  }
  //draw the dino
  draw() {
    this.ctx.fillRect(this.x, this.y, this.size.w - 5, this.size.h);
    this.ctx.drawImage(
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
  //running animation
  running(objects) {
    if (this.frames >= 10) {
      this.frames = 4;
    }
    if (this.jumped) {
      this.frames = 10;
    } else {
      this.frames++;
    }
    this.yoffset = this.y + this.size.h;
    if (this.collide(objects)) return true;
    return false;
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
  collide(objects) {
    for (let i = 0; i < (objects.length > 1 ? 2 : 1); i++) {
      if (this.x < objects[i].area[0][1] && this.xoffset > objects[i].area[0][0]) {
        if (
          this.yoffset > objects[i].area[1][0] 
        ) {
          const sound = new Audio("./sounds/hit.mp3");
          sound.play();
          return true;
        }
      }
    }
  }
}
