import './App.css';
import React, {useEffect, useState} from "react";
import RTC from './widgets/RTC.js';
import DateWidget from './widgets/Date.js';
import PeriodName from './widgets/PeriodName.js';
import Countdown from "./widgets/Countdown.js";
import WeatherWidget from './widgets/WeatherWidget.js';
import Timekeeper from './components/Timekeeper.js';
import Textbox from './widgets/Textbox.js';

import "@fontsource/inconsolata";


function App() {
    const [schedule, setSchedule] = useState([]);
    
    const [countdown, setCountdown] = useState(null);
    const [periodName, setPeriodName] = useState("");

    const [siteLayout, setSiteLayout] = useState({backgroundColor: "#000000"});
    const [widgetList, setWidgetList] = useState([]);

    const [weather, setWeather] = useState(null);

    const [displayList, setDisplayList] = useState([]);


    const portNum = 8000; // Change this number in order to change which port the server is listening on
    const serverUrl = 'ws://localhost:' + portNum; // may need to change this if we host the server on a different url
    
    // Deal with WebSocket stuff. should run only once at the start ()
    useEffect(() =>
    {
        const ws = new WebSocket(serverUrl); // represents the client socket

        ws.addEventListener("message", e => 
        {
            const data = JSON.parse(e.data);

            setSchedule(data.schedule);
            setSiteLayout(data.layout.site);
            setWidgetList(data.layout.widgetList);
            setWeather(data.weather);
            
            return () => {ws.close();};
        });
    }, [serverUrl]);

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
                    tempDisplayList.push(<Countdown id={i} deltaTime={countdown} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
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
                case "default": console.log("Widget Type ERROR (This should not print)");
            }
        }

        setDisplayList(tempDisplayList);
    }, [widgetList, periodName, countdown, weather]);

    return (     
        <div className="App" style={{backgroundColor:siteLayout.backgroundColor}}>
            <Timekeeper schedule={schedule} countdownCallback={(data) => setCountdown(data)} periodNameCallback={(data) => setPeriodName(data)}/>
            {displayList}
        </div>
    );
}

export default App;