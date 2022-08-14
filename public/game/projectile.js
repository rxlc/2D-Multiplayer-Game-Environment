class Projectile {
    constructor(
      x,
      y,
      radius,
      color,
      xVel,
      yVel,
      speed,
      life,
      offsetX,
      offsetY,
      angle,
      damage
    ) {
      this.playerX = x;
      this.playerY = y;
  
      this.angle = angle;
  
      this.damage = damage;
  
      this.offsetX = offsetX;
      this.offsetY = offsetY;
  
      this.radius = radius;
  
      this.color = color;
  
      this.xVel = xVel;
      this.yVel = yVel;

      this.ownerId = undefined;
  
      this.mag = this.xVel * this.xVel + this.yVel * this.yVel;
  
      this.finalXVel = (this.xVel / this.mag) * speed;
      this.finalYVel = (this.yVel / this.mag) * speed;
  
      this.life = life;
  
      this.duration = 0;
  
      this.opacity = 1;
  
      this.fade = 30;
    }
  
    convertOffset() {
      let angle = this.angle;
  
      let xVel = Math.cos(this.angle);
      let yVel = Math.sin(this.angle);
  
      let mag = Math.sqrt(xVel * xVel + yVel * yVel);
  
      let ox = (xVel / mag) * this.offsetY + this.playerX;
      let oy = (yVel / mag) * this.offsetY + this.playerY;
  
      let cross = this.angle + Math.PI / 2;
  
      let crossx = Math.cos(cross);
      let crossy = Math.sin(cross);
  
      let crossmag = Math.sqrt(crossx * crossx + (crossy + crossy));
  
      let cx = (crossx / mag) * this.offsetX + ox;
      let cy = (crossy / mag) * this.offsetX + oy;
  
      this.x = cx;
      this.y = cy;
    }
  
    update(projectileList) {
      if (this.duration < this.life) {
        if (this.duration == 0) {
          this.convertOffset();
        }
  
        this.x = this.x + this.finalXVel;
        this.y = this.y + this.finalYVel;
  
        this.duration++;
  
        if (this.life - this.duration < this.fade) {
          let durationLeft = this.fade - (this.life - this.duration);
          this.opacity = 1 - durationLeft * (1 / this.fade);
        }
      } else {
        projectileList.shift();
      }
    }
  }

  module.exports.projectileObject = Projectile;