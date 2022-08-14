class clientProjectile {
    constructor(
      x,
      y,
      radius,
      color,
      opacity
    ) {
      this.x = x;
      this.y = y;
  
      this.radius = radius;
  
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;

      this.opacity = opacity;
    }
  
    draw(context, xView, yView) {
      context.save();
  
      let localX = this.x - this.radius - xView;
      let localY = this.y - this.radius - yView;
  
      context.fillStyle =
        "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.opacity + ")";
      context.beginPath();
      context.arc(localX, localY, this.radius, 0, Math.PI * 2, false);
      context.fill();
      context.closePath();
  
      context.restore();
    }
  }