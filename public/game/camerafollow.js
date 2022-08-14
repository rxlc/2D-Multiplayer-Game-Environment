class followObject {
    constructor(player) {
      this.player = player;
  
      this.x = 100;
      this.y = 100;
  
      this.accelx = 0;
      this.accely = 0;
  
      this.width = 20;
      this.height = 20;
  
      this.intensity = 40;
  
      this.i = 0;
  
      this.vmode = 0;
    }
  
    update(xView, yView) {
      this.vmode = 0;
  
      this.localmousex = mouseX - window.innerWidth / 2;
      this.localmousey = mouseY + window.innerHeight / 2;
  
      if (
        this.localmousex > (-1 * window.innerWidth) / 2 &&
        this.localmousex < window.innerWidth / 2 &&
        this.localmousey > (-1 * window.innerHeight) / 2 &&
        this.localmousey < window.innerHeight / 2
      ) {
        this.transformx = Math.pow(this.localmousex / 120, 3);
        this.transformy = Math.pow(this.localmousey / 80, 3);
        this.drag(
          this.player.x + this.transformx,
          this.player.y + this.transformy
        );
      } else {
        this.drag(this.player.x, this.player.y);
      }
    }
  
    drag(x, y) {
      this.desx = x;
      this.desy = y;
  
      this.xneg = false;
      this.yneg = false;
  
      this.distx = this.desx - this.x;
      this.disty = this.desy - this.y;
  
      if (this.i == 0) {
        this.constantdistx = this.distx;
        this.constantdisty = this.disty;
        this.i++;
      }
  
      if (this.distx < 0) {
        this.xneg = true;
      }
  
      if (this.disty < 0) {
        this.yneg = true;
      }
  
      this.magforx = Math.sqrt(
        this.distx * this.distx + this.constantdisty * this.constantdisty
      );
  
      this.magfory = Math.sqrt(
        this.constantdistx * this.constantdistx + this.disty * this.disty
      );
  
      this.magx = this.distx / this.magforx;
      this.magy = this.disty / this.magfory;
  
      if (this.xneg) {
        if (this.x - this.desx > 0.1) {
          this.accelx = this.magx * this.intensity;
          this.x = this.x + this.accelx;
        } else {
          this.x = this.desx;
        }
      } else {
        if (this.desx - this.x > 0.1) {
          this.accelx = this.magx * this.intensity;
          this.x = this.x + this.accelx;
        } else {
          this.x = this.desx;
        }
      }
  
      if (this.yneg) {
        if (this.y - this.desy > 0.1) {
          this.accely = this.magy * this.intensity;
          this.y = this.y + this.accely;
        } else {
          this.y = this.desy;
        }
      } else {
        if (this.desy - this.y > 0.1) {
          this.accely = this.magy * this.intensity;
          this.y = this.y + this.accely;
        } else {
          this.y = this.desy;
        }
      }
    }
  
    draw(context, xView, yView) {
      context.save();
      context.fillStyle = "orange";
  
      let localX = this.x - this.width / 2 - xView;
      let localY = this.y - this.height / 2 - yView;
  
      context.fillRect(localX, localY, this.width, this.height);
      context.restore();
    }
  }
  
  Game.followObject = followObject;
  