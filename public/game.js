window.onload = init;

function init() {
  var socket = io.connect('http://localhost:4000');

  var canvas = document.getElementById("gameCanvas");
  var context = canvas.getContext("2d");

  mouseX = 0;
  mouseY = 0;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var room = {
    width: 2000,
    height: 2000,
    map: new Game.Map(2000,2000)
  };

  room.map.generate();

  //Dictonary for keeping the other players with their socket id
  var otherPlayers = {};

  //Creating the player for this specific client
  var player = new Game.Player(Math.floor(Math.random()*1500)+250,Math.floor(Math.random()*1500)+250);

  socket.emit('new-player', { x: player.x, y: player.y, angle: player.angle});

  socket.on('update-players',function(data){
    var playersFound = {};

    //Loops through the player dictionary given
    for (var id in data) {
      //If the other client is not on otherPlayers dictionary and not the client itself, make a new player for that other client
      if (otherPlayers[id] == undefined && id != socket.id) {
        var playerData = data[id];
        var newPlayer = new Game.Player(playerData.x,playerData.y);
        otherPlayers[id] = newPlayer;
      }

      playersFound[id] = true;

      //Updates other player's position and rotation
      if (id != socket.id) {
        otherPlayers[id].x = data[id].x;
        otherPlayers[id].y = data[id].y;  
        otherPlayers[id].angle = data[id].angle;
      }
    }

    //Checks for disconnected player
    for (var id in otherPlayers) {
      if (playersFound[id] == undefined) {
        console.log("Other players disconnected")
        delete otherPlayers[id];
      }
    }

  });


  //Checking latency
  var startTime;

  setInterval(function() {
    startTime = Date.now();
    socket.emit('ping');
  }, 2000);
  
  socket.on('pong', function() {
    latency = Date.now() - startTime;

    Game.latency = latency;
  });

  var projectiles = [];
  
  var hitmarkers = [];

  var vWidth = Math.min(room.width, canvas.width);
  var vHeight = Math.min(room.height, canvas.height);
  
  var followObject = new Game.followObject(player);
  
  var followObjectShow = false;
  
  var firing = false;
  
  var delay = 0;
  
  var debounce = false;

  var camera = new Game.Camera(0, 0, vWidth, vHeight, room.width, room.height);
  camera.follow(followObject, vWidth / 2, vHeight / 2);
  camera.boundaryLock = false
      
  Game.activePlayer = player
  Game.activeCamera = camera
  Game.activefollowObject = followObject
  Game.hitmarkers = hitmarkers
  Game.projectiles = projectiles
  Game.firing = firing
  Game.debounce = debounce
  Game.delay = delay

  var update = function() {

    followObject.update(camera.xView,camera.yView);
    
    player.update(room.width, room.height, camera.xView, camera.yView);
    
    for (let i=0; i<projectiles.length; i++) {
      projectiles[i].update(Game.projectiles);
    }
    
    for (let i=0; i<hitmarkers.length; i++) {
      hitmarkers[i].update(Game.hitmarkers);
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
    } else {
      if (Game.delay >= Game.activePlayer.fireDelay || Game.delay == 0) {
        Game.delay = 0;
        Game.debounce = false;
      } else {
        Game.delay++;
      }
    }

    socket.emit('move-player', { x: Game.activePlayer.x, y: Game.activePlayer.y, angle: Game.activePlayer.angle});
  }

  var draw = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    room.map.draw(context, camera.xView, camera.yView);

    player.draw(context,camera.xView,camera.yView)

    for (var id in otherPlayers) {
      otherPlayers[id].draw(context,camera.xView,camera.yView)
    }
    
    if (followObjectShow) {
      followObject.draw(context,camera.xView,camera.yView)
    }
    
    for (let i=0; i<projectiles.length; i++) {
      projectiles[i].draw(context,camera.xView,camera.yView)
    }
    
    for (let i=0;i< hitmarkers.length; i++) {
      hitmarkers[i].draw(context,camera.xView,camera.yView);
    }
    
    
    //Minimap
    context.fillStyle = "#7e7b78"
    context.fillRect(15,window.innerHeight-305,210,210)
    context.fillStyle = "#333333"
    context.fillRect(20,window.innerHeight-300,200,200)
    
    let miniMapx = Game.activePlayer.x
    let miniMapy = Game.activePlayer.y
    
    context.fillStyle = "#efe8db"
    context.fillRect((miniMapx/10)+20,(miniMapy/10)+innerHeight-300,10,10)


    //Fps/ping display
    drawText(context,camera.xView,camera.yView,35,412,{r:255,g:255,b:255},1,"Fps: " + fps,12,false);

    if (Game.latency == undefined) {
      drawText(context,camera.xView,camera.yView,80,412,{r:255,g:255,b:255},1,"Ping: "  ,12,false);  
    } else {
      drawText(context,camera.xView,camera.yView,80,412,{r:255,g:255,b:255},1,"Ping: " + Game.latency,12,false);
    }
  }
  
  let secondsPassed;
  let oldTimeStamp;
  let fps;


  function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    update();
    draw();

    window.requestAnimationFrame(gameLoop);
  }

  window.requestAnimationFrame(gameLoop);

  canvas.addEventListener("mousedown",function(evt) {
    Game.firing = true;
  }, false);

  canvas.addEventListener("mouseup", function(evt) {
    Game.firing = false;
  }, false);

  canvas.addEventListener("mousemove",function(evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = evt.clientX - rect.left,
    mouseY = evt.clientY - rect.top
    mouseY-=750;
  }, false);
}

Game.controls = {
  left: false,
  up: false,
  right: false,
  down: false,
};

window.addEventListener("keydown", function(e) {
  if (e.key == 'a' || e.key == 'ArrowLeft') {
    Game.controls.left = true;
  } else if (e.key == 'w' || e.key == 'ArrowUp') {
    Game.controls.up = true;
  } else if (e.key == 'd' || e.key == 'ArrowRight') {
    Game.controls.right = true
  } else if (e.key == 's' || e.key == 'ArrowDown') {
    Game.controls.down = true;
  } else if (e.key == 'f') {
    Game.activePlayer.switchWeapons();
  }
  
}, false);

window.addEventListener("keyup", function(e) {
  if (e.key == 'a' || e.key == 'ArrowLeft') {
    Game.controls.left = false;
  } else if (e.key == 'w' || e.key == 'ArrowUp') {
    Game.controls.up = false;
  } else if (e.key == 'd' || e.key == 'ArrowRight') {
    Game.controls.right = false;
  } else if (e.key == 's' || e.key == 'ArrowDown') {
    Game.controls.down = false;
  } 
}, false);