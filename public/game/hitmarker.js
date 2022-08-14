class hitmarker {
    constructor(x,y,damage) {
      this.x = x+(Math.random()*50)-25
      this.y = y+(Math.random()*20)-10
      this.velX = 0
      this.velY = -3
      this.accelX = 0
      this.accelY = 0.1
      
      this.damage = damage
      this.opacity = 1;
    }
    
    update(markerList) {
      this.x = this.x + this.velX
      this.y = this.y + this.velY
      
      if (this.velY < 0) {    
        this.velX+=this.accelX;
        this.velY+=this.accelY;
      } else {
        this.velY = 0;
      }
      
      if (this.opacity > 0) {
        this.opacity-= 0.025
      } else {
        this.opacity = 0;
        markerList.shift();
      }
    }
    
    draw(context,xView,yView) {
      context.save();
      
      let localX = this.x - xView
      let localY = this.y - yView
      
      context.font = "16px sans-serif";
      context.fillStyle = 
        "rgba(255,255,255," + this.opacity + ")"
      context.fillText(this.damage, localX, localY);
      
      context.restore();
    }
  }
  
  Game.hitmarker = hitmarker;