class hitmarker {
    constructor(x,y,damage) {
      this.position = createVector(x+(Math.random()*50)-25,y+(Math.random()*20)-10)
      this.velocity = createVector(0,-3)
      this.acceleration = createVector(0,0.1)
      
      this.damage = damage
      this.opacity = 1;
    }
    
    update(markerList) {
      this.position.add(this.velocity)
      
      if (this.velocity.y < 0) {    
        this.velocity.add(this.acceleration)
      } else {
        this.velocity.y = 0;
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
      
      let localX = this.position.x - xView
      let localY = this.position.y - yView
      
      context.font = "16px sans-serif";
      context.fillStyle = 
        "rgba(255,255,255," + this.opacity + ")"
      context.fillText(this.damage, localX, localY);
      
      context.restore();
    }
  }
  
  Game.hitmarker = hitmarker;