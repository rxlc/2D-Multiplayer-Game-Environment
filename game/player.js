class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
  
      this.xVel = 0;
      this.yVel = 0;
  
      this.acceleration = 0.1;
      this.maxSpeed = 2.1;
  
      this.angle = 0;
  
      this.side = 50;
  
      this.r = 154;
      this.g = 134;
      this.b = 164;
  
      this.angleOffset = -1.54;
  
      this.vmode = 4;
      this.umode = 1;
      this.pmode = 1;
      
      this.modeDisplay = false;
      this.modeDisplayTime = 0;
      
      this.uCooldown = false
      this.uTimer = 0;
      
      this.inventoryShow = true;
      
      this.latestSwap = null;
      
    }
  
    pickUp(coresList) {
      
      let closestIndex;
      let closest = 80;
      
      if (coresList.length > 0) {
        for (let i=0; i<coresList.length; i++) {
          if (dist(this.x,this.y,coresList[i].position.x,coresList[i].position.y) < 80) {
            if (dist(this.x,this.y,coresList[i].position.x,coresList[i].position.y) < closest) {
              closestIndex = i;
              closest = dist(this.x,this.y,coresList[i].position.x,coresList[i].position.y)
            }
          }
        }
        
        let replacedType = coresList[closestIndex].type
        this.latestSwap = replacedType
        
        let replacedNum;
        
        if (replacedType == "v") {
          replacedNum = this.vmode;
        } else if (replacedType == "u") {
          replacedNum = this.umode
        }
        
        let replacedCore = new Utility(this.x,this.y,replacedType,replacedNum,true,this.angle)
        
        if (replacedType == "v") {
          this.vmode = coresList[closestIndex].num
        } else if (replacedType == "u") {
           this.umode = coresList[closestIndex].num
        }
        
        this.modeDisplay = true;
        this.modeDisplayTime = 0;
        
        coresList.splice(closestIndex,1)
        coresList.push(replacedCore)
        
      }
      
    }
    
    useUtility() {
      if (this.uCooldown == false) {
        this.uCooldown = true;
        
        if (this.umode == 1) { 
          let angle = this.angle;    
          
          let xVel = Math.cos(this.angle);
          let yVel = Math.sin(this.angle);
  
          let mag = Math.sqrt(xVel * xVel + yVel * yVel);
  
          let ox = (xVel / mag) * 500
          let oy = (yVel / mag) * 500
          
          this.x = this.x + ox;
          this.y = this.y + oy;
        }
      }
    }
  
    drawText(context, xView, yView, x, y, color, opacity, textContent, size) {
      context.save();
  
      let localX = x - xView;
      let localY = y - yView;
  
      context.font = "bold " + size + "px sans-serif";
      context.fillStyle =
        "rgba(" + color.r + "," + color.g + "," + color.b + "," + opacity + ")";
      context.fillText(textContent, localX, localY);
  
      context.restore();
    }
  
    update(worldWidth, worldHeight, xView, yView) {
      
      if (this.uCooldown) {
        if (this.uTimer < 400) {
          this.uTimer++
        } else {
          this.uTimer = 0;
          this.uCooldown = false;
        }
      }
      
      if (this.vmode == 1) {
        this.damage = 15;
        this.fireDelay = 35;
        this.spread = 0.1;
        this.bulletSpeed = 5;
        this.range = 100;
        this.size = 8.5;
      }
  
      if (this.vmode == 2) {
        this.damage = 10;
        this.fireDelay = 50;
        this.spread = 0.12;
        this.bulletSpeed = 4.6;
        this.range = 90;
        this.size = 8.5;
      }
  
      if (this.vmode == 3) {
        this.damage = 35;
        this.fireDelay = 100;
        this.spread = 0.03;
        this.bulletSpeed = 10;
        this.range = 160;
        this.size = 8;
      }
  
      if (this.vmode == 4) {
        this.damage = 3;
        this.fireDelay = 80;
        this.spread = 0.25;
        this.bulletSpeed = 3
        this.range = 60
        this.size = 7
      }
      
      if (Game.controls.left) {
        if (this.xVel >= this.maxSpeed * -1) {
          this.xVel -= this.acceleration;
        }
      } else {
        if (this.xVel < 0) {
          this.xVel += this.acceleration;
        }
      }
  
      if (Game.controls.up) {
        if (this.yVel >= this.maxSpeed * -1) {
          this.yVel -= this.acceleration;
        }
      } else {
        if (this.yVel < 0) {
          this.yVel += this.acceleration;
        }
      }
  
      if (Game.controls.right) {
        if (this.xVel <= this.maxSpeed) {
          this.xVel += this.acceleration;
        }
      } else {
        if (this.xVel > 0) {
          this.xVel -= this.acceleration;
        }
      }
  
      if (Game.controls.down) {
        if (this.yVel <= this.maxSpeed) {
          this.yVel += this.acceleration;
        }
      } else {
        if (this.yVel > 0) {
          this.yVel -= this.acceleration;
        }
      }

      if (this.yVel >= -0.1 && this.yVel <= 0.1 && (Game.controls.up == false)&&(Game.controls.down == false)) {
        this.yVel = 0;
      }
      
      if (this.xVel >= -0.1 && this.xVel <= 0.1 && (Game.controls.left == false)&&(Game.controls.right == false)) {
        this.xVel = 0;
      }


      this.localmousex = mouseX - window.innerWidth / 2;
      this.localmousey = mouseY + window.innerHeight / 2;
  
      this.worldmouseX = xView + window.innerWidth / 2 + this.localmousex;
      this.worldmouseY = yView + window.innerHeight / 2 + this.localmousey;
  
      this.angle = Math.atan2(
        this.worldmouseY - this.y,
        this.worldmouseX - this.x
      );
  
      this.x = this.x + this.xVel;
      this.y = this.y + this.yVel;
  
      if (this.x - this.side / 2 < 0) {
        this.x = this.side / 2;
      }
      if (this.y - this.side / 2 < 0) {
        this.y = this.side / 2;
      }
      if (this.x + this.side / 2 > worldWidth) {
        this.x = worldWidth - this.side / 2;
      }
      if (this.y + this.side / 2 > worldHeight) {
        this.y = worldHeight - this.side / 2;
      }
    }
  
    draw(context, xView, yView,coresList) {
      
      for (let i=0; i<coresList.length; i++) {
        let distance = dist(coresList[i].position.x,coresList[i].position.y,this.x,this.y)
        
        if (distance < 150) {
          let coreName;
          let xShift;
          let opacity = map(distance,0,150,2,0)
          
          if (coresList[i].type == "v") {
            if (coresList[i].num == 1) {
              coreName = "Basic Shot"
              xShift = -40
            }
            if (coresList[i].num == 2) {
              coreName = "Double Shot"
              xShift = -45
            }
            if (coresList[i].num == 3) {
              coreName = "Ranged Shot"
              xShift = -45
              
            }
            if (coresList[i].num == 4) {
              coreName = "Cluster Pellets"
              xShift = -54
            }
          }
          
          if (coresList[i].type == "u") {
            if (coresList[i].num == 1) {
              coreName = "Teleport"
              xShift = -20
            }
          }
          
          if (coresList[i].type == "p") {
            if (coresList[i].num == 1) {
              coreName = "Shield"
              xShift = -20
            }
          }
      
          this.drawText(context,xView,yView,coresList[i].position.x+xShift,coresList[i].position.y-30,{r:255,g:255,b:255},opacity,coreName,16)  
        }
      }
      
      
      if (this.modeDisplay) {
        this.alpha = 1;
        this.modeDisplayTime++;
        
        if (this.latestSwap == "v") {
    
          if (this.vmode == 1) {
            if (this.modeDisplayTime > 50) {
              this.alpha = 1 - (this.modeDisplayTime - 50) * 0.02;
            }
  
            this.drawText(
              context,
              xView,
              yView,
              this.x - 45,
              this.y - 80,
              { r: 255, g: 255, b: 255 },
              this.alpha,
              "Basic Shot",
              18
            );
            this.drawText(
              context,
              xView,
              yView,
              this.x - 25,
              this.y - 55,
              { r: 178, g: 39, b: 39 },
              this.alpha,
              "Vitality",
              15
            );
          }
  
          if (this.vmode == 2) {
            if (this.modeDisplayTime > 50) {
              this.alpha = 1 - (this.modeDisplayTime - 50) * 0.02;
            }
  
            this.drawText(
              context,
              xView,
              yView,
              this.x - 50,
              this.y - 80,
              { r: 255, g: 255, b: 255 },
              this.alpha,
              "Double Shot",
              18
            );
            this.drawText(
              context,
              xView,
              yView,
              this.x - 25,
              this.y - 55,
              { r: 178, g: 39, b: 39 },
              this.alpha,
              "Vitality",
              15
            );
          }
  
          if (this.vmode == 3) {
            if (this.modeDisplayTime > 50) {
              this.alpha = 1 - (this.modeDisplayTime - 50) * 0.02;
            }
  
            this.drawText(
              context,
              xView,
              yView,
              this.x - 55,
              this.y - 80,
              { r: 255, g: 255, b: 255 },
              this.alpha,
              "Ranged Shot",
              18
            );
            this.drawText(
              context,
              xView,
              yView,
              this.x - 25,
              this.y - 55,
              { r: 178, g: 39, b: 39 },
              this.alpha,
              "Vitality",
              15
            );
          }
  
          if (this.vmode == 4) {
            if (this.modeDisplayTime > 50) {
              this.alpha = 1 - (this.modeDisplayTime - 50) * 0.02;
            }
  
            this.drawText(
              context,
              xView,
              yView,
              this.x - 60,
              this.y - 80,
              { r: 255, g: 255, b: 255 },
              this.alpha,
              "Cluster Pellets",
              18
            );
            this.drawText(
              context,
              xView,
              yView,
              this.x - 25,
              this.y - 55,
              { r: 178, g: 39, b: 39 },
              this.alpha,
              "Vitality",
              15
            );
          }
        }
        
        if (this.latestSwap == "u") {
          if (this.vmode == 1) {
            if (this.modeDisplayTime > 50) {
              this.alpha = 1 - (this.modeDisplayTime - 50) * 0.02;
            }
  
            this.drawText(
              context,
              xView,
              yView,
              this.x - 38,
              this.y - 80,
              { r: 255, g: 255, b: 255 },
              this.alpha,
              "Teleport",
              18
            );
            this.drawText(
              context,
              xView,
              yView,
              this.x - 25,
              this.y - 55,
              { r: 78, g:148, b:79 },
              this.alpha,
              "Utility",
              15
            );
          }
  
        }
        
        if (this.latestSwap == "p") {
          if (this.pmode == 1) {
            if (this.modeDisplayTime > 50) {
              this.alpha = 1 - (this.modeDisplayTime - 50) * 0.02;
            }
  
            this.drawText(
              context,
              xView,
              yView,
              this.x - 30,
              this.y - 80,
              { r: 255, g: 255, b: 255 },
              this.alpha,
              "Shield",
              18
            );
            this.drawText(
              context,
              xView,
              yView,
              this.x - 50,
              this.y - 55,
              { r: 104, g:167, b:173 },
              this.alpha,
              "Preservability",
              15
            );
          }
  
        }
      
      
      }
  
      context.save();
  
      let localX = this.x - this.side / 2 - xView;
      let localY = this.y - this.side / 2 - yView;
  
      let pivotX = localX + this.side / 2;
      let pivotY = localY + this.side / 2;
  
      context.translate(pivotX, pivotY);
  
      context.rotate(this.angle + this.angleOffset);
  
      context.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "1)";
  
      context.lineWidth = 5;
  
      context.beginPath();
  
      context.moveTo(0, 45);
  
      context.lineTo(-38.971, -22.5);
  
      context.lineTo(38.971, -22.5);
  
      context.lineTo(0, 45);
  
      context.closePath();
  
      context.fill();
  
      context.translate(-pivotX, -pivotY);
  
      context.restore();
    }
  
    shoot(projectileList) {
      let angle = this.angle;
  
      angle = angle + Math.random() * (this.spread * 2) - this.spread;
  
      let xVel = Math.cos(angle);
      let yVel = Math.sin(angle);
      
      if (this.vmode == 1) {
        let projectile = new Game.Projectile(
          this.x,
          this.y,
          this.size,
          { r: 247, g: 110, b: 37 },
          xVel,
          yVel,
          this.bulletSpeed,
          this.range,
          0,
          40,
          this.angle,
          this.damage
        );
  
        projectileList.push(projectile);
      }
  
      if (this.vmode == 2) {
        for (let i = 0; i < 2; i++) {
          let projectile = new Game.Projectile(
            this.x,
            this.y,
            this.size,
            { r: 247, g: 110, b: 37 },
            xVel,
            yVel,
            this.bulletSpeed,
            this.range,
            -15 + i * 30,
            40,
            this.angle,
            this.damage
          );
  
          projectileList.push(projectile);
        }
      }
  
      if (this.vmode == 3) {
        let projectile = new Game.Projectile(
          this.x,
          this.y,
          this.size,
          { r: 247, g: 110, b: 37 },
          xVel,
          yVel,
          this.bulletSpeed,
          this.range,
          0,
          40,
          this.angle,
          this.damage
        );
  
        projectileList.push(projectile);
      }
      
      if (this.vmode == 4) {
        for (let i=0;i<18;i++) {
          
          let angle = this.angle;
  
          angle = angle + Math.random() * (this.spread * 2) - this.spread;
  
          let xVel = Math.cos(angle);
          let yVel = Math.sin(angle);
          
          let projectile = new Game.Projectile(
          this.x,
          this.y,
          this.size,
          { r: 247, g: 110, b: 37 },
          xVel,
          yVel,
          (Math.random()*this.bulletSpeed)+4,
          this.range,
          Math.random()*2-1,
          40,
          this.angle,
          this.damage
        );
  
        projectileList.push(projectile);
        }
      }
    }
    
  }
  
  Game.Player = Player;