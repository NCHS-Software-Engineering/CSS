import './App.css';
import React from 'react';
import RTC from './widgets/RTC.js';
import PeriodName from './widgets/PeriodName.js';
import Countdown from "./widgets/Countdown.js"
import {WeatherWidget} from "./widgets/react-weather-widget"

function App() {
    return (
        <div className="App">
            <div className='Title'>
                <h1><PeriodName/></h1>
            </div>
            <div className='Content'> 
                <p><Countdown/></p>
                <WeatherWidget
                    provider='tomorrow'
                    apiKey='RZ9VFKI7n0GVdUEJ1lBVZ6wjdJn26CGJ'
                    location='Naperville'
                    tempUnit="F"
                    windSpeedUnit="mps"
                    lang="en"
                />
            </div>
        </div>
    );
}

export default App;