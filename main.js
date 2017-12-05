var express = require('express');
var app = express();

// Create an http server which pipes to the express app.
var server = require('http').createServer(app);

// Create an socket io handler which pipes to the http server.
var io = require('socket.io')(server);

io.on('connection', function(client) {
    console.log('Client connected');

    // Emit a 'message' event to the client.
    client.emit("connection-registered", {hello: 'World'});

    // Setup the server socket to listen for incoming client messages, forwarding them to the other clients.
    client.on('message', function(message) {
        client.broadcast.emit('message', message);
    });
});

// server the index file.
app.get('/', function(request, response) {
    // Super userful for sending html views.
    response.sendFile(__dirname + '/views/index.html');
});

server.listen(8080);