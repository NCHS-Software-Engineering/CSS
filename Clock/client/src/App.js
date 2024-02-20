import './App.css';
import React from 'react';
import RTC from './widgets/RTC.js';
import PeriodName from './widgets/PeriodName.js';
import Countdown from "./widgets/Countdown.js";
import WeatherWidget from './widgets/components/weather/index.jsx';

function App() {
    return (
        <div className="App">
            <div className='Title'>
                <h1><PeriodName/></h1>
            </div>
            <div className='Content'> 
                <p><Countdown/></p>
                <p><WeatherWidget/></p>
            </div>
        </div>
    );
}

export default App;