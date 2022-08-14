//Looks for express in node_modules folder and use it in this code
var express = require('express');
var socket = require('socket.io');

var projectileObject = require('./public/game/projectile.js').projectileObject

//Reference the express function and run it
var app = express();

//Listen for requests in a specific port number
var server = app.listen(process.env.PORT || 4000)

//Automatically display the index.html file in the public folder
app.use(express.static('public'));

//Setting up socket, with the server as parameter. 
var io = socket(server);

//Dictionary to keep track of all players with their socket id
var players = {};

var projectileArray = [];

//Calls when a connection is established, each user has their own individual socket
io.on('connection', function(socket){
    console.log("New client has connected, id:",socket.id);

    //Latency test
    socket.on('ping', function() {
        socket.emit('pong');
    });

    //Whenever new client connects, sent from client
    socket.on('new-player',function(data){ // Listen for new-player event on this client
    /*
      console.log("New player position info:",data);
    */
      players[socket.id] = data;

      io.emit('update-players',players);
    })

    //Whenever a client disconnects
    socket.on('disconnect', function(data){
        console.log("Client disconnected, id:",socket.id);
        delete players[socket.id];

        io.emit('update-players',players);
    });

    //Whenever a client moves, and updates all other clients on it
    socket.on('move-player',function(data) {
        if (players[socket.id] == undefined) return;
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        players[socket.id].angle = data.angle;

        io.emit('update-players',players);
    });

    //Listens for shoot event and add to bullet array
    socket.on('shoot',function(data){
        if (players[socket.id] == undefined) return;
            var newProjectile = new projectileObject(data.x,data.y,data.size,data.color,data.xVel, data.yVel, data.bulletSpeed, data.range, data.offsetX, data.offsetY, data.angle, data.damage);

            data.ownerId = socket.id;
            projectileArray.push(newProjectile);
    });
})

function serverLoop() {
    for (let i=0; i<projectileArray.length; i++) {
        let currentProjectile = projectileArray[i];

        currentProjectile.update(projectileArray);

        /*
        for (var id in players) {
            if (projectile.ownerId != id) {
                var dx = players[id].x - currentProjectile.x;
                var dy = players[id].y - currentProjectile.y;
                var dist = Math.sqrt(dx*dx + dy * dy);

                if (dist < 50) {
                    io.emit('player-hit',id);
                }
            }
        }
        */
    }

    io.emit("update-projectiles",projectileArray);
}

setInterval(serverLoop,16);