import React, {useState, useEffect} from "react";
import './index.css';

import {ReactComponent as MoonSVG} from '../../assets/svgs/dark_mode_FILL1_wght400_GRAD0_opsz24.svg'
import {ReactComponent as CloudSVG} from '../../assets/svgs/cloud_FILL1_wght400_GRAD0_opsz24.svg'

function WeatherWidget(props = null) // props.weatherData
{
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        if (!props) return;
        if (props.weatherData) setWeatherData(props.weatherData);

        // console.log("hello", props.weatherData);
    }, [props]);

    if(!weatherData) return <div>Loading...</div>

    const isDayTime = weatherData.isDaytime
    const cloudSize = 51

    return (
        <div className='weather-widget'>
            {isDayTime ? <div className='sun'></div> : <MoonSVG className='moon'/>}
            <div className='cloud-container'>
                {cloudSize > 50 && <CloudSVG className='cloud'/>}
            </div>
            <div className='temperature'>{weatherData.temperature}°</div>
            <div className='weather'>{weatherData.shortForecast}</div>
            <div className='location'>Naperville</div>
            <div className='humidity'>Humidity: {weatherData.relativeHumidity.value}%</div>
        </div>
    );
}

export default WeatherWidget;