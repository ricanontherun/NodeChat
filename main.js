var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

// Create an http server which pipes to the express app.
var server = require('http').createServer(app);

// Create an socket io handler which pipes to the http server.
var io = require('socket.io')(server);

var connected_clients = {};

// When a connection is made, setup some event handlers.
io.on('connection', function(client) {
    connected_clients[client.id] = {
        alias: ""
    };

    // Emit a 'message' event to the client.
    client.emit('connection-registered', {
        id: client.id
    });

    // Setup the server socket to listen for incoming client messages, forwarding them to the other clients.
    client.on(client.id + '-message', function(message) {
        // Send the message to ourselves.
        client.emit('message-relay', message);

        // broadcast the message to everyone else.
        client.broadcast.emit('message-relay', message);
    });
});

// server the index file.
app.get('/', function(request, response) {
    // Super userful for sending html views.
    response.sendFile(__dirname + '/views/index.html');
});

app.post('/join', function(request, response) {
    console.log(request.body);
});

server.listen(8080);