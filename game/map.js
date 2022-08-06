class Map {
    constructor(width, height) {
      this.width = width;
      this.height = height;
  
      this.image = null;
    }
  
    generate() {
      var ctx = document.createElement("canvas").getContext("2d");
      ctx.canvas.width = this.width;
      ctx.canvas.height = this.height;
  
      var rows = ~~(this.width / Game.gridSize) + 1;
      var columns = ~~(this.height / Game.gridSize) + 1;
  
      ctx.save();
      ctx.fillStyle = Game.gridColor;
      ctx.strokeStyle = Game.lineColor;
      for (let x = 0, i = 0; i < rows; x += Game.gridSize, i++) {
        ctx.beginPath();
        for (let y = 0, j = 0; j < columns; y += Game.gridSize, j++) {
          ctx.lineWidth = Game.lineWidth;
          ctx.rect(x, y, Game.gridSize, Game.gridSize);
          ctx.fill();
          ctx.stroke();
        }
        ctx.closePath();
      }
      ctx.restore();
  
      // store the generate map as this image texture
      this.image = new Image();
      this.image.src = ctx.canvas.toDataURL("image/png");
  
      // clear context
      ctx = null;
    }
  
    draw(context, xView, yView) {
      var sx, sy, dx, dy;
      var sWidth, sHeight, dWidth, dHeight;
  
      sx = xView;
      sy = yView;
  
      sWidth = context.canvas.width;
      sHeight = context.canvas.height;
  
      if (this.image.width - sx < sWidth) {
        sWidth = this.image.width - sx;
      }
      if (this.image.height - sy < sHeight) {
        sHeight = this.image.height - sy;
      }
  
      dx = 0;
      dy = 0;
  
      dWidth = sWidth;
      dHeight = sHeight;
  
      context.drawImage(
        this.image,
        sx,
        sy,
        sWidth,
        sHeight,
        dx,
        dy,
        dWidth,
        dHeight
      );
    }
  }
  
  Game.Map = Map;
  