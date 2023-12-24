var webSocket = require("ws"); // import websockets
var fileSystem = require("fs"); // import filesystem

const portNum = 8000; // Change this number in order to change which port the server is listening on

const serverSocket = new webSocket.Server({port : portNum}); // represents the server socket


const connections = new Set(); // A set containing all of the client sockets


serverSocket.on('connection', (clientSocket) => onConnect(clientSocket)); // runs when a new client connects

function onConnect(clientSocket)
{
    connections.add(clientSocket); // store the client socket

    console.log("Num Clients (add): " + connections.size); // DEBUG

    clientSocket.on('close', () => onClose(clientSocket)); // runs when a client disconnects
}
function onClose (clientSocket)
{
    connections.delete(clientSocket); // remove the client socket
}
