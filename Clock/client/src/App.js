import './App.css';
import React, {useEffect, useState} from "react";
import RTC from './widgets/RTC.js';
import PeriodName from './widgets/PeriodName.js';
import Countdown from "./widgets/Countdown.js";
import WeatherWidget from './widgets/components/weather/index.jsx';
import Timekeeper from './components/Timekeeper.js';


function App() {
    const [schedule, setSchedule] = useState([]);
    
    const [countdown, setCountdown] = useState(null);
    const [periodName, setPeriodName] = useState("");

    const [widgetList, setWidgetList] = useState([]);

    const [weather, setWeather] = useState([]);


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
            setWidgetList(data.layout);
            setWeather(data.weather);
            console.log(weather);   

            return () => {ws.close();};
        });
    }, [serverUrl]);


    function renderWidgetList()
    {
        const displayList = [];

        for (const w of widgetList)
        {
            switch(w.type)
            {
                case "countdown": 
                    displayList.push(<Countdown deltaTime={countdown} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                case "clock":
                    displayList.push(<RTC col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                case "periodName":
                    displayList.push(<PeriodName periodName={periodName} col={w.col} row={w.row} width={w.width} height={w.height} config={w.config}/>);
                    break;
                case "default": console.log("Widget Type ERROR (This should not print)");
            }
        }

        return displayList;
    }


    return (     
        <div className="App">
            <Timekeeper schedule={schedule} countdownCallback={setCountdown} periodNameCallback={setPeriodName}/>
            {renderWidgetList()}
        </div>
    );
}

export default App;