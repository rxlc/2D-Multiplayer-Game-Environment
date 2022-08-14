//Looks for express in node_modules folder and use it in this code
var express = require('express');
var socket = require('socket.io');

//Reference the express function and run it
var app = express();

//Listen for requests in a specific port number
var server = app.listen(4000, function(){
    console.log("Listening to requests on port 4000");
});

//Automatically display the index.html file in the public folder
app.use(express.static('public'));

//Setting up socket, with the server as parameter. 
var io = socket(server);

//Dictionary to keep track of all players with their socket id
var players = {};

var bulletArray = [];

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
    });
})
