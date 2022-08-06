Game = {};

Game.gridSize = 30;
Game.gridColor = "#312f2f";

Game.lineWidth = 1;
Game.lineColor = "#444444";

Game.canvasInfo = document.getElementById("gameCanvas");
Game.canvasHeight = 660;
Game.canvasWidth = 1400;

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

  set(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width || this.width;
    this.height = height || this.height;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

  within(r) {
    return (
      r.x <= this.x &&
      r.right > this.right &&
      r.y <= this.y &&
      r.bottom >= this.bottom
    );
  }
}

Game.Rectangle = Rectangle;
