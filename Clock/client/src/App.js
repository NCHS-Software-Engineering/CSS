import './App.css';
import React, {useEffect, useState} from "react";
import RTC from './widgets/RTC.js';
import DateWidget from './widgets/Date.js';
import PeriodName from './widgets/PeriodName.js';
import Countdown from "./widgets/Countdown.js";
import WeatherWidget from './widgets/WeatherWidget.js';
import Timekeeper from './components/Timekeeper.js';
import Textbox from './widgets/Textbox.js';
import { Box, Button, Divider, Modal, Paper, TextField } from "@mui/material";

import "@fontsource/inconsolata";


function App() {
    const [room, setRoom] = useState(initiateRoom());
    const [tempRoom, setTempRoom] = useState(room);
    const [overlay, setOverlay] = useState(false);


    const [schedule, setSchedule] = useState([]);
    
    const [countdown, setCountdown] = useState(null);
    const [periodName, setPeriodName] = useState("");

    const [siteLayout, setSiteLayout] = useState({backgroundColor: "#000000"});
    const [widgetList, setWidgetList] = useState([]);

    const [weather, setWeather] = useState(null);

    const [displayList, setDisplayList] = useState([]);

    
    // Deal with WebSocket stuff. should run only once at the start
    useEffect(() =>
    {
        const portNum = 8000; // Change this number in order to change which port the server is listening on
        const serverUrl = 'ws://localhost:' + portNum; // may need to change this if we host the server on a different url

        const ws = new WebSocket(serverUrl); // represents the client socket

        // send the server the room number
        ws.addEventListener("open", e => 
        {
            ws.send(room); // TODO: implement configurable / saved rooms
        });

        // receive messages from the server
        ws.addEventListener("message", e => 
        {
            const data = JSON.parse(e.data);

            setSchedule(data.schedule);
            setSiteLayout(data.layout.site);
            setWidgetList(data.layout.widgetList);
            setWeather(data.weather);
            
            return () => {ws.close();};
        });

        return () => {ws.close();};
    }, [room]);

    useEffect(() => 
    {
        const tempDisplayList = [];

        // console.log("rendering widgets");

        for (let i = 0; i < widgetList.length; i++)
        {
            const w = widgetList[i];

            switch(w.type)
            {
                case "countdown": 
                    tempDisplayList.push(<Countdown id={i} deltaTime={countdown} periodName={periodName} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                case "clock":
                    tempDisplayList.push(<RTC id={i} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                case "date":
                    tempDisplayList.push(<DateWidget id={i} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                case "periodName":
                    tempDisplayList.push(<PeriodName id={i} periodName={periodName} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                case "weather":
                    tempDisplayList.push(<WeatherWidget id={i} weatherData={weather} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                case "textbox":
                    tempDisplayList.push(<Textbox id={i} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                default: console.log("Widget Type ERROR (This should not print)");
            }
        }

        setDisplayList(tempDisplayList);
    }, [widgetList, periodName, countdown, weather]);
    
    function initiateRoom() // the selected rooms should be based on query params. If no query params, default to using the stored cookie.
    {
        var roomParam = window.location.search;
        roomParam = roomParam.substring(roomParam.indexOf("room=")+5);
        if (roomParam.indexOf("&") !== -1) roomParam = roomParam.substring(0, roomParam.indexOf("&"));
        
        return roomParam ? roomParam : getRoomCookie();
    }
    function getRoomCookie() // assuming only 1 cookie present
    {
        var res = document.cookie.substring(document.cookie.indexOf("room=")+5);
        if (res.indexOf(";") !== -1) res = res.substring(0, res.indexOf(";"));
        return (res === "" || res === undefined) ? "[NONE]" : res;
    }
    function setRoomCookie(name)
    {
        document.cookie = "room=" + name + "; max-age=2147483647"; // set the cookie to expires in a very long time
    }

    // when the 'ESC' key is pressed, open the modal
    document.body.onkeydown = function (e) {
        if (overlay === false && e.key === "Escape")
        {
            setTempRoom(room);
            setOverlay(true);
        }
    }


    return (     
        <div className="App" style={{backgroundColor:siteLayout.backgroundColor}}>
            <Timekeeper schedule={schedule} countdownCallback={(data) => setCountdown(data)} periodNameCallback={(data) => setPeriodName(data)}/>
            {displayList}

            <Modal
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowY: "scroll"
                }}
                open={overlay}
                onClose={() => setOverlay(false)}
            >
                <Box sx={{display: "flex", flexDirection: "column", width: "14cm", maxWidth: "90%"}}>
                    <Paper elevation={7} sx={{display: "flex", flexDirection: "column", alignItems: "center", padding: 1, width: "100%"}}>
                        <TextField variant="filled" label="Room Name" value={tempRoom} onInput={(e) => setTempRoom(e.target.value)}></TextField>
                        <Divider sx={{marginTop: 1, marginBottom: 1, width:"100%"}}/>
                        <Button variant="contained" size="large" onClick={() => {setRoomCookie(tempRoom); setRoom(tempRoom);}}>Save</Button>
                    </Paper>
                </Box>
            </Modal>
        </div>
    );
}

export default App;