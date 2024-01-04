// ----- Imports

const WebSocket = require("ws"); // import websockets
const FileSystem = require("fs"); // import filesystem


// ----- Set up the files -----


// make sure that the "files" directory exists
if (FileSystem.existsSync("files") === false) // make sure the files directory exists 
{
    FileSystem.mkdirSync("files");
}
// make sure that all of the important files storeing the Scheduals, Calendar, etc. exist
if (FileSystem.existsSync("files/schedules") === false) // create an empty dictionary of all schedules
{
    const data = {};
    FileSystem.writeFileSync("files/schedules.json", JSON.stringify(data));
}
if (FileSystem.existsSync("files/defaultWeek") === false) // create a dictionary matching the day to the schedule
{
    const data = {Monday : null, Tuesday : null, Wednesday : null, Thursday : null, Friday : null, Saturday : null, Sunday : null};
    FileSystem.writeFileSync("files/defaultWeek", JSON.stringify(data));
}
if (FileSystem.existsSync("files/calendar") === false) // create an empty list of all upcoming special schedules
{
    const data = [];
    FileSystem.writeFileSync("files/calendar", JSON.stringify(data));
}


// ----- WebSockets Stuff -----

const portNum = 8000; // Change this number in order to change which port the server is listening on
const wss = new WebSocket.Server({port : portNum}); // represents the server socket

const connections = new Set(); // A set containing all of the client sockets
// send information to all connections
async function broadCast()
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