#!/usr/bin/env node
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', (error) => {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });

    connection.on('message', function(message) {
        if (message.type === 'utf8' ) {
            console.log(message.utf8Data);
        }
    });

    function sendToken() {
        if (connection.connected) {
            connection.sendUTF(JSON.stringify({
                token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6Ik1pY2hhxYIiLCJsYXN0TmFtZSI6IlfEhXNvd2ljeiIsImZiUHJvZmlsZUlkIjoiOTU4MDg1Njk3Njc5Njk3IiwiZmFjdWx0aWVzIjpbeyJpZCI6NSwidXNlcl9mYWN1bHR5Ijp7ImlzQWRtaW4iOmZhbHNlfX1dfQ.j9hwbJMXRs2Mw7J0inXK7Vuqv_TSrYUDSxrA5LOaRZM",
                facultyId: 5
            }));
            setTimeout(sendToken, 1000);
        }
    }
    sendToken()
});


client.connect('ws://localhost:5001/', 'echo-protocol');