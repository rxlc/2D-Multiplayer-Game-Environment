class Camera {
    constructor(xView, yView, wView, hView, worldWidth, worldHeight) {
      this.xView = xView || 0;
      this.yView = yView || 0;
  
      this.xDeadZone = 0;
      this.yDeadZone = 0;
  
      this.wView = wView;
      this.hView = hView;
  
      this.followed = null;
  
      this.boundaryLock = true;
  
      this.viewportRect = new Game.Rectangle(
        this.xView,
        this.yView,
        this.wView,
        this.hView
      );
      this.worldRect = new Game.Rectangle(0, 0, worldWidth, worldHeight);
    }
  
    follow(gameObject, xDeadZone, yDeadZone) {
      this.followed = gameObject;
      this.xDeadZone = xDeadZone;
      this.yDeadZone = yDeadZone;
    }
  
    update() {
      if (this.followed != null) {
        if (this.followed.x - this.xView + this.xDeadZone > this.wView)
          this.xView = this.followed.x - (this.wView - this.xDeadZone);
        else if (this.followed.x - this.xDeadZone < this.xView)
          this.xView = this.followed.x - this.xDeadZone;
        if (this.followed.y - this.yView + this.yDeadZone > this.hView)
          this.yView = this.followed.y - (this.hView - this.yDeadZone);
        else if (this.followed.y - this.yDeadZone < this.yView)
          this.yView = this.followed.y - this.yDeadZone;
      }
  
      this.viewportRect.set(this.xView, this.yView);
  
      if (this.boundaryLock) {
        if (!this.viewportRect.within(this.worldRect)) {
          if (this.viewportRect.x < this.worldRect.x)
            this.xView = this.worldRect.x;
          if (this.viewportRect.y < this.worldRect.y)
            this.yView = this.worldRect.x;
          if (this.viewportRect.right > this.worldRect.right)
            this.xView = this.worldRect.right - this.wView;
          if (this.viewportRect.bottom > this.worldRect.bottom)
            this.yView = this.worldRect.bottom - this.hView;
        }
      }
    }
  }
  
  Game.Camera = Camera;