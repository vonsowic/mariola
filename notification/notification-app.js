#!/usr/bin/env node
require('dotenv').config();
const app = require('express')();
const WebSocketServer = require('websocket').server;
const http = require('http');
const DBBridge = require('./DatabaseBridge');
const channels = require('./channels');


const facultyRooms = new Map();

const getFaculty = id => {
    let faculty = facultyRooms.get(id);

    if(!faculty){
        faculty = new Map();
        facultyRooms.set(id, faculty)
    }

    return faculty
};

const setConnection = ({facultyIds, userId}, connection) =>
    facultyIds.forEach(fid => getFaculty(fid).set(userId, connection));

const handleConnect = (message, connection) => {
    try {
        setConnection(JSON.parse(message.utf8Data), connection);
    } catch(err) {
        connection.send('Error')
    }
};


const originIsAllowed = origin => true;

const server = http.createServer(app);

// TODO: security issues
const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});


wsServer.on('request', request => {
    console.log(`New client`)
    if (!originIsAllowed(request.origin)) {
        request.reject();
        return;
    }

    const connection = request.accept('echo-protocol', request.origin);
    connection.on('message', message => handleConnect(message, connection));

    // TODO: handling closed connections
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

const createMessage = (channel, record) =>
    JSON.stringify({
        channel,
        record
    });

const sendToEachOnChannel = channel => record => {
    getFaculty(record.facultyId)
        .forEach(conn => conn.send(createMessage(channel, record)))
};

const onNewExchangeListener = record => {
    const notifyIfPossible = id => {
        let conn = getFaculty(record.facultyId)
            .get(id);

        if(conn){
            conn.send(createMessage(channels.EXCHANGE_CREATED, record))
        }
    };

    notifyIfPossible(record.userFrom);
    notifyIfPossible(record.userTo);
};

new DBBridge()
    .setListenerOn(channels.INTENTION_CREATED, sendToEachOnChannel(channels.INTENTION_CREATED))
    .setListenerOn(channels.INTENTION_REMOVED, sendToEachOnChannel(channels.INTENTION_REMOVED))
    .setListenerOn(channels.EXCHANGE_CREATED, onNewExchangeListener);

module.exports= port => {

    server.listen(port, () => {
        console.log(`Notification server is listening on port ${port}`);
    });

    return server
};

// module.exports(5001)