var webSocket = require("ws"); // import websockets
var fileSystem = require("fs"); // import filesystem

const portNum = 8000; // Change this number in order to change which port the server is listening on

const serverSocket = new webSocket.Server({port : portNum}); // represents the server socket


serverSocket.on('connection', (clientSocket) => onConnect(clientSocket)); // runs when a new client connects

function onConnect(clientSocket)
{
    console.log("A client has connected!");

    clientSocket.on('close', (clientSocket) => onClose(clientSocket)); // runs when a client disconnects
}
function onClose (clientSocket)
{
    console.log("A client closed their connection :(");
}
