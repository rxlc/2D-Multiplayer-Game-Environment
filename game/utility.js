class Utility {
    constructor(x,y,type,num,drop,playerAngle) {
      this.position = createVector(x,y)
      
      //For dropping/replacing
      this.velocity = createVector(0,0)
      this.acceleration = createVector(0,0)
      
      this.angle = playerAngle
      
      if (drop) {
        let angle = this.angle;
  
        let xVel = Math.cos(this.angle);
        let yVel = Math.sin(this.angle);
  
        let mag = Math.sqrt(xVel * xVel + yVel * yVel);
  
        this.velocity.x = (xVel / mag)*4;
        this.velocity.y = (yVel / mag)*4;
        
        this.acceleration.x = (this.velocity.x * -1)/20
        this.acceleration.y = (this.velocity.y * -1)/20
      }
      
      this.type = type
      this.num = num
      
      this.opacity = 1
      
      this.duration = 0;
      
      this.angle = 0;
      
      this.dradius = 15;
      this.noiseValue = 0;
      
      this.noiseX = [0,0,0];
      this.noiseY = [0,0,0];
      
      this.sinCount = 0;
      this.sinCount2 = 0;
    }
    
    update(coresList) {
      this.angle = this.angle + 0.01
      
      this.duration++;
      if (this.duration > 500) {
        coresList.shift();
      }
      
      this.position.add(this.velocity) 
      
      if (!(mag(this.velocity.x,this.velocity.y) > -0.1 && mag(this.velocity.x,this.velocity.y) < 0.1)) {
        this.velocity.add(this.acceleration)
      } else {
        this.velocity.setMag(0);
      }
    }
    
    draw(context,xView,yView) {
      context.save();
      
      let localX = this.position.x - xView
      let localY = this.position.y - yView
      
      context.translate(localX,localY);
      
      if (this.type == "v") {
        this.noiseValue+=0.12;
        let n = noise(this.noiseValue) * 12
      
        this.radius = this.dradius + n
        
        
        context.strokeStyle =
        "rgb(133,31,28)"
        context.rotate(this.angle)
        context.beginPath();
        context.lineWidth = 5
        context.moveTo(-24,0)
        context.lineTo(12,-20.5)
        context.lineTo(12,20.5)
        context.lineTo(-24,0)
        context.stroke();
        context.closePath();
        
        context.fillStyle = "rgba(219,31,24,0.6)"
        context.beginPath();
        context.arc(0,0,this.radius, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
        
        context.fillStyle = "rgb(236,38,32)"
        context.beginPath()
        context.arc(0,0,8, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
      }
      
      if (this.type == "u") {
        this.sinCount2 += 0.02;
        
        context.strokeStyle = "rgb(78, 148, 79)"
        for (let i=0; i<5; i++) {
          this.noiseX[i]+=(0.1*(i+1))
          this.noiseY[i]+=(0.12*(i+1))
          
          let x = (noise(this.noiseX[i])*10)-5
          let y = (noise(this.noiseY[i])*10)-5
          
          context.lineWidth = 3;
          context.beginPath();
          
          context.arc(x,y,13, 0, Math.PI * 2, false);
          context.closePath();
          context.stroke();
        }
        
        context.fillStyle = "rgba(78, 148, 79,0.4)"
        context.beginPath();
        context.arc(0,0,Math.abs(sin(this.sinCount2)*25), 0, Math.PI * 2, false);
        context.closePath();
        context.fill()
        
        context.fillStyle = "rgb(131, 189, 117)"
        context.beginPath();
        context.arc(0,0,8, 0, Math.PI * 2, false);
        context.closePath();
        context.fill()
      }
      
      if (this.type == "p") {
        this.sinCount+=0.03
        
        context.fillStyle = "rgb(72,191,227)"
        context.beginPath();
        context.arc(0,0,8, 0, Math.PI * 2, false);
        context.closePath();
        context.fill() 
        
        context.rotate(this.angle);
        context.lineWidth = 4
        context.strokeStyle = "rgb(83,144,217)"
        context.strokeRect(-15,-15,30,30)
        
        context.fillStyle = "rgba(73,153,248,0.6)"
        context.beginPath();
        context.arc(0,0,Math.abs(sin(this.sinCount)*22),0,Math.PI*2,false);
        context.closePath();
        context.fill();
      }
      
      context.translate(-localX,-localY)
      
      context.restore();
    }
  }
  
  Game.utility = Utility;