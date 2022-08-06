class Enemy {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
  
      this.width = 50;
      this.height = 50;
  
      this.color = {
        r: null,
        g: null,
        b: null,
      };
  
      this.orgColor = {
        r: color.r,
        g: color.g,
        b: color.b,
      };
  
      this.health = 100;
  
      this.enemyMove = false;
  
      this.timing = 0;
  
      this.rdiff = (255 - this.orgColor.r) / 50;
      this.gdiff = (255 - this.orgColor.g) / 50;
      this.bdiff = (255 - this.orgColor.b) / 50;
  
      this.rdiffDown = (66 - this.orgColor.r) / 30;
      this.gdiffDown = (63 - this.orgColor.g) / 30;
      this.bdiffDown = (62 - this.orgColor.b) / 30;
  
      this.hit = false;
  
      this.timeFull = 0;
  
      this.timeAfterHit = 0;
  
      this.healthAlpha = 1;
  
      this.downed = false;
  
      this.timeSinceDowned = 0;
      this.grayTiming = 0;
  
      this.opacity = 1;
    }
  
    update(worldWidth, worldHeight, projectileList, markerList) {
      if (this.x - this.width / 2 < 0) {
        this.x = this.width / 2;
      }
      if (this.y - this.height / 2 < 0) {
        this.y = this.height / 2;
      }
      if (this.x + this.width / 2 > worldWidth) {
        this.x = worldWidth - this.width / 2;
      }
      if (this.y + this.height / 2 > worldHeight) {
        this.y = worldHeight - this.height / 2;
      }
  
      if (!this.downed) {
        this.color.r = this.orgColor.r + this.rdiff * this.timing;
        this.color.g = this.orgColor.g + this.gdiff * this.timing;
        this.color.b = this.orgColor.b + this.bdiff * this.timing;
  
        this.hit = false;
        for (let i = 0; i < projectileList.length; i++) {
          if (projectileList[i].x && projectileList[i].y) {
            if (
              dist(this.x, this.y, projectileList[i].x, projectileList[i].y) < 40
            ) {
              this.hit = true;
              if (this.timing > 10) {
                if (this.health > 0) {
                  if (this.health - projectileList[i].damage <= 0) {
                    let marker = new Game.Marker (this.x,this.y,projectileList[i].damage)
                    
                    markerList.push(marker)
                    
                    this.health = 0;
                    this.downed = true;
                    
                  } else {
                    this.health = this.health - projectileList[i].damage;
                    
                    let marker = new Game.Marker (this.x,this.y,projectileList[i].damage)
                    
                    markerList.push(marker)
                  }
                }
                projectileList.splice(i, 1);
              }
            }
          }
        }
  
        if (this.hit) {
          if (this.timing < 50) {
            this.timing += 10;
          }
          this.timeAfterHit = 0;
          this.healthAlpha = 1;
        } else {
          if (this.timing > 0) {
            this.timing -= 5;
          }
  
          this.timeAfterHit++;
        }
  
        if (this.timeAfterHit >= 100) {
          if (this.health < 100) {
            this.health += 0.3;
          } else {
            this.health = 100;
          }
        }
  
        if (this.health == 100) {
          this.timeFull++;
        } else {
          this.timeFull = 0;
        }
  
        if (this.timeFull > 60) {
          if (this.healthAlpha > 0) {
            this.healthAlpha -= 0.03;
          } else {
            this.healthAlpha = 0;
          }
        }
      } else {
        this.timeSinceDowned++;
  
        if (this.grayTiming < 30) {
          this.grayTiming++;
        }
  
        this.color.r = this.orgColor.r + this.rdiffDown * this.grayTiming;
        this.color.g = this.orgColor.g + this.gdiffDown * this.grayTiming;
        this.color.b = this.orgColor.b + this.bdiffDown * this.grayTiming;
  
        if (this.timeSinceDowned < 30) {
          if (this.healthAlpha) {
            this.healthAlpha = 1 - 0.05 * this.timeSinceDowned;
          }
        }
  
        if (this.timeSinceDowned > 100) {
          if (this.opacity > 0) {
            this.opacity = 1 - (this.timeSinceDowned - 100) * 0.05;
          } else {
            this.opacity = 0;
          }
        }
      }
    }
  
    draw(context, xView, yView) {
      context.save();
      context.fillStyle =
        "rgba(" +
        this.color.r +
        "," +
        this.color.g +
        "," +
        this.color.b +
        "," +
        this.opacity +
        ")";
  
      let localX = this.x - this.width / 2 - xView;
      let localY = this.y - this.height / 2 - yView;
  
      context.fillRect(localX, localY, this.width, this.height);
  
      context.fillStyle = "rgba(99,6,6," + this.healthAlpha + ")";
      context.fillRect(localX - 10, localY + 60, 70, 6);
  
      context.fillStyle = "rgba(221,24,21," + this.healthAlpha + ")";
      context.fillRect(localX - 10, localY + 60, this.health * 0.7, 6);
  
      context.restore();
    }
  }
  
  Game.Enemy = Enemy;
  