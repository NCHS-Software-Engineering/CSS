import './App.css';
import React, {useState} from "react";
import RTC from './widgets/RTC.js';
import PeriodName from './widgets/PeriodName.js';
import Countdown from "./widgets/Countdown.js";
import WeatherWidget from './widgets/components/weather/index.jsx';

function App() {
    const [inputValue, setInputValue] = useState('Naperville');
    const [location, setLocation] = useState('Naperville');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLocation(inputValue);
    }
    return (
        <div className="App">
            <div className='Title'>
                <h1><PeriodName/></h1>
            </div>
            <div className='Content'> 
                <p><Countdown/></p>
            </div>
            <div>
                <form onSubmit={handleFormSubmit}>
                    <input type="text" value={inputValue} 
                    onChange={(e)=>{setInputValue(e.target.value)}}/>
                    <button type="submit">Update Location</button>
                </form>
                <p><WeatherWidget location={location}/></p>
            </div>
        </div>
    );
}

export default App;