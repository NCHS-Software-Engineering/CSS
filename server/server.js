const WebSocket = require("ws"); // import websockets
const FileSystem = require("fs"); // import filesystem

const portNum = 8000; // Change this number in order to change which port the server is listening on
const wss = new WebSocket.Server({port : portNum}); // represents the server socket

const connections = new Set(); // A set containing all of the client sockets
// send information to all connections
function broadCast()
{
    connections.forEach(ws => {
        ws.send("Server Connection Count: " + connections.size);
    });
}

// runs when a new client connects
wss.on('connection', (ws) => 
{
    connections.add(ws); // store the client socket

    broadCast();

    // runs when a client disconnects
    ws.on('close', () => 
    {
        connections.delete(ws); // remove the client socket

        broadCast();
    }); 
}); 