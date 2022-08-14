Game = {};

Game.gridSize = 30;
Game.gridColorOne = "#312f2f";
Game.gridColorTwo = "#2f2c2c";
Game.gridColorThree = "#2e2a2a"

Game.lineWidth = 1;
Game.lineColor = "#444444";

Game.canvasInfo = document.getElementById("gameCanvas");
Game.canvasHeight = 660;
Game.canvasWidth = 1400;

//Will change later

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

function drawText(context, xView, yView, x, y, color, opacity, textContent, size, fixed = true) {
  context.save();

  if (fixed) {
    let localX = x - xView;
    let localY = y - yView;

    context.font = size + "px Arial";
    context.fillStyle =
      "rgba(" + color.r + "," + color.g + "," + color.b + "," + opacity + ")";

    context.fillText(textContent, localX, localY);
  } else {
    context.fillStyle =
      "rgba(" + color.r + "," + color.g + "," + color.b + "," + opacity + ")";
    context.fillText(textContent, x,y);
  }

  context.restore();
}

Game.drawText = drawText;