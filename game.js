(function() {
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    var room = {
      width: 2000,
      height: 2000,
      map: new Game.Map(2000,2000)
    };
  
    room.map.generate();
  
    var player = new Game.Player(500,500);
    
    var projectiles = [];
    
    var enemies = []
    
    let enemy = new Game.Enemy(250,400,{r:178,g:39,b:39});
    
    enemies.push(enemy);
    
    var markers = [];
    
    var cores = [];
  
    var vWidth = Math.min(room.width, canvas.width);
    var vHeight = Math.min(room.height, canvas.height);
    
    var followObject = new Game.followObject(player,enemy);
    
    var followObjectShow = false;
    
    var firing = false;
    
    var delay = 0;
    
    var debounce = false;
  
    var camera = new Game.Camera(0, 0, vWidth, vHeight, room.width, room.height);
    camera.follow(followObject, vWidth / 2, vHeight / 2);
    camera.boundaryLock = false
    
    var update = function() {
      followObject.update(camera.xView,camera.yView);
      
      for (let i=0; i<enemies.length; i++) {
        enemies[i].update(room.width,room.height,Game.projectiles,Game.markers);
      }
      
      player.update(room.width, room.height, camera.xView, camera.yView);
      
      for (let i=0; i<projectiles.length; i++) {
        projectiles[i].update(Game.projectiles,Game.activeEnemy);
      }
      
      for (let i=0; i<markers.length; i++) {
        markers[i].update(Game.markers)
      }
      
      for (let i=0; i<cores.length; i++) {
        cores[i].update(Game.cores)
      }
      
      camera.update();
      
      if (Game.firing) {
        if (Game.debounce == false) {
          Game.activePlayer.shoot(Game.projectiles);
          Game.debounce = true;
        } else {
          Game.delay++;
          if (Game.delay == Game.activePlayer.fireDelay) {
            Game.delay = 0;
            Game.debounce = false;
          }
        }
      }
    }
  
    var draw = function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      room.map.draw(context, camera.xView, camera.yView);
      
      for (let i=0;i< cores.length; i++) {
        cores[i].draw(context,camera.xView,camera.yView)
      }
      
      for (let i=0;i<enemies.length; i++) {
        enemies[i].draw(context, camera.xView, camera.yView);
      }
      
      player.draw(context, camera.xView, camera.yView,Game.cores);
      if (followObjectShow) {
        followObject.draw(context,camera.xView,camera.yView)
      }
      
      for (let i=0; i<projectiles.length; i++) {
        projectiles[i].draw(context,camera.xView,camera.yView)
      }
      
      for (let i=0;i< markers.length; i++) {
        markers[i].draw(context,camera.xView,camera.yView);
      }
      
      
      //Minimap
      context.fillStyle = "#7e7b78"
      context.fillRect(15,window.innerHeight-225,210,210)
      context.fillStyle = "#333333"
      context.fillRect(20,window.innerHeight-220,200,200)
      
      let miniMapx = Game.activePlayer.x
      let miniMapy = Game.activePlayer.y
      
      context.fillStyle = "#efe8db"
      context.fillRect((miniMapx/10)+20,(miniMapy/10)+innerHeight-220,10,10)
  
    }
    
    Game.gameLoop = function() {
      update();
      draw();
    }
    
    Game.activePlayer = player
    Game.activeCamera = camera
    Game.activefollowObject = followObject
    Game.activeEnemy = enemy
    Game.markers = markers
    Game.projectiles = projectiles
    Game.cores = cores
    Game.firing = firing
    Game.debounce = debounce
    Game.delay = delay
    Game.enemies = enemies
  
  })();
  
  Game.controls = {
    left: false,
    up: false,
    right: false,
    down: false,
  };
  
  window.addEventListener("keydown", function(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
      Game.controls.left = true;
    } else if (e.keyCode == 38 || e.keyCode == 87) {
      Game.controls.up = true;
    } else if (e.keyCode == 39 || e.keyCode == 68) {
      Game.controls.right = true
    } else if (e.keyCode == 40 || e.keyCode == 83) {
      Game.controls.down = true;
    } else if (e.keyCode == 70) {
      Game.activePlayer.pickUp(Game.cores);
    } else if (e.keyCode == 82) {
      Game.activePlayer.useUtility();
    }
  }, false);
  
  window.addEventListener("keyup", function(e) {
    if (e.keyCode == 37 || e.keyCode == 65) {
      Game.controls.left = false;
    } else if (e.keyCode == 38 || e.keyCode == 87) {
      Game.controls.up = false;
    } else if (e.keyCode == 39 || e.keyCode == 68) {
      Game.controls.right = false;
    } else if (e.keyCode == 40 || e.keyCode == 83) {
      Game.controls.down = false;
    } 
  }, false);
  
  function mousePressed() {
    Game.firing = true;
  }
  
  function mouseReleased() {
    Game.firing = false;
  }
  
  /*
  function debug() {
    createCanvas(800,80)
    background(28)
    let playerX = Math.floor(Game.activePlayer.x)
    let playerY = Math.floor(Game.activePlayer.y)
    
    let playerXVel = Math.round(Game.activePlayer.xVel*100)/100
    let playerYVel = Math.round(Game.activePlayer.yVel*100)/100
    
    let cameraX = Math.floor(Game.activeCamera.xView)
    let cameraY = Math.floor(Game.activeCamera.yView)
    
    let followObjectMag = Math.floor(Game.activefollowObject.mag)
    
  
    fill(255);
    textSize(14);
    
    text("Player: ",10,25)
    text("x: " + playerX,10,45)
    text("y: " + playerY,60,45)
  
    text("xVel: " + playerXVel,120,45)
    text("yVel: " + playerYVel,120,65)
    
    text("Camera: ",200,25)
    text("x: " + cameraX,200,45)
    text("y: " + cameraY,250,45)
    
    text("Mouse: (local)",320,25)
    text("x: " + Math.floor(Game.activefollowObject.localmousex),320, 45)
    text("y: " + Math.floor(Game.activefollowObject.localmousey),370, 45)
    
    text("(global)",420,25)
    text("x: " + Math.floor(Game.activePlayer.worldmouseX),420, 45)
    text("y: " + Math.floor(Game.activePlayer.worldmouseY),470, 45)
    
    text("Spawn:",580,25)
      
  }
  
  function setup() {
    let spawnInput = createInput("");
    spawnInput.position(580,690)
    spawnInput.size(150)
    spawnInput.input(spawnCore)
  }
  */
  
  function spawnCore() {
    if (this.value() == "v1") {
      let core = new Core(Game.activePlayer.x-40,Game.activePlayer.y-40,"v",1,false,null)
      
      Game.cores.push(core)
    }
    if (this.value() == "v2") {
      let core = new Core(Game.activePlayer.x-40,Game.activePlayer.y-40,"v",2,false,null)
      
      Game.cores.push(core)
    }
    if (this.value() == "v3") {
      let core = new Core(Game.activePlayer.x-40,Game.activePlayer.y-40,"v",3,false,null)
      
      Game.cores.push(core)
    }
    if (this.value() == "v4") {
      let core = new Core(Game.activePlayer.x-40,Game.activePlayer.y-40,"v",4,false,null)
      
      Game.cores.push(core)
    }
    if (this.value() == "u1") {
      let core = new Core(Game.activePlayer.x-40,Game.activePlayer.y-40,"u",1,false,null)
      
      Game.cores.push(core)
    }
    if (this.value() == "p1") {
      let core = new Core(Game.activePlayer.x-40,Game.activePlayer.y-40,"p",1,false,null)
      
      Game.cores.push(core)
    }
    
    
    if (this.value() == "cube") {
      let cube = new Game.Enemy(Game.activePlayer.x+((Math.random()*500)-250),Game.activePlayer.y+((Math.random()*500)-250),{r:178,g:39,b:39});
      
      Game.enemies.push(cube)
      
    }
  }
  
  
  function draw() {
    Game.gameLoop()
  }
  