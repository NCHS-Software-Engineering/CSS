// ----- Imports & Initializations


const WebSocket = require("ws"); // import websockets
const FileSystem = require("fs"); // import filesystem
const Scheduler = require("node-schedule"); // import 

const connections = new Set(); // A set containing all of the client sockets
var today; // today's schedule


// ----- File Managment -----


// make sure that the "files" directory exists
if (FileSystem.existsSync("files") === false) // make sure the files directory exists 
{
    FileSystem.mkdirSync("files");
}
// make sure that all of the important files storeing the Schedules, Calendar, etc. exist
if (FileSystem.existsSync("files/schedules.json") === false) // create an empty dictionary of all schedules
{
    const data = {};
    FileSystem.writeFileSync("files/schedules.json", JSON.stringify(data));
}
if (FileSystem.existsSync("files/defaultWeek.json") === false) // create a dictionary matching the day to the schedule
{
    const data = {0 : null, 1 : null, 2 : null, 3 : null, 4 : null, 5 : null, 6 : null}; // Sunday - Saturday : 0 - 6
    FileSystem.writeFileSync("files/defaultWeek.json", JSON.stringify(data));
}
if (FileSystem.existsSync("files/calendar.json") === false) // create an empty dictionary of all dates
{
    const data = {};
    FileSystem.writeFileSync("files/calendar.json", JSON.stringify(data));
}

function getCurrentSchedule(callback)
{    
    // figure out todays schedule

    const calendar = JSON.parse(FileSystem.readFileSync("files/calendar.json"));
    const schedules = JSON.parse(FileSystem.readFileSync("files/schedules.json"));

    var dateKey;
    var scheduleKey;

    const tempDate = new Date();
    dateKey = tempDate.getMonth() * 100;
    dateKey += tempDate.getDate();

    if (calendar[dateKey]) // check special schedules first
    { 
        scheduleKey = calendar[dateKey]['schedule'];
    }
    else // check the default schedules
    {
        const defaultWeek = JSON.parse(FileSystem.readFileSync("files/defaultWeek.json"));
        
        scheduleKey = defaultWeek[tempDate.getDay()];
    }

    var res = schedules[scheduleKey];
    if (!res) res = [];

    callback(res);

    // if yesterday's schedule was a special one time schedule, delete it // TODO: Testing Needed !!!

    // get yesterday's date info
    tempDate.setDate(tempDate.getDate() - 1);
    dateKey = tempDate.getMonth() * 100;
    dateKey += tempDate.getDate();

    if (calendar[dateKey] && calendar[dateKey]['repeating'] === false)
    {
        delete calendar[dateKey];
        FileSystem.writeFileSync("files/calendar.json", JSON.stringify(calendar)); // replace the calendar file with the updated calendar
    }
}

getCurrentSchedule((res) => {today = res;}); // initialize today's schedule

// ----- WebSocket Managment -----


const portNum = 8000; // Change this number in order to change which port the server is listening on
const wss = new WebSocket.Server({port : portNum}); // represents the server socket

async function broadCast() // send information to all connections
{
    connections.forEach(ws => {
        updateClient(ws);
    });
}
async function updateClient(ws) // send information to an individual client
{
    ws.send(JSON.stringify(today));
}

// runs when a new client connects
wss.on('connection', (ws) => 
{
    updateClient(ws); // send the new client the schedule

    connections.add(ws); // store the client socket

    // runs when a client disconnects
    ws.on('close', () => 
    {
        connections.delete(ws); // remove the client socket
    }); 
});


// ----- Scheduling -----


// every day at midnight ...
const job = Scheduler.scheduleJob("0 0 * * *", () =>
{
    getCurrentSchedule((res) => 
    {
        today = res; // reset today's schedule (it's a new day)
        broadCast(); // broadCast the changes to any connected clients
    });
});