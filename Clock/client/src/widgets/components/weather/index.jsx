import React, { useState, useEffect, useRef} from "react";
import './index.css';

import axios from 'axios';

import { ReactComponentElement as MoonSVG} from '../../assets/svgs/dark_mode_FILL1_wght400_GRAD0_opsz24.svg'
import { ReactComponentElement as CloudSVG} from '../../assets/svgs/cloudy_FILL1_wght400_GRAD0_opsz24.svg'

const WeatherWidget = ({location}) => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        if(location.length){
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=37e1ff1b9e12fbd215a7b5f22ca17eef&&unites=metric`)
            .then((response) => {
                setWeatherData(response.data);
            }).catch((error) => {
                console.log("error: ", error);
            });
        }
    } , [location]);

    if(!weatherData) return <div>Loading...</div>

    const currentTimeUTC = new Date().getTime() / 1000
    const localTime = currentTimeUTC + weatherData.timezone
    const isDayTime = localTime > weatherData.sys.sunrise && localTime < weatherData.sys.sunset
    const cloudSize = weatherData.clouds.all

    return (
        <div className='weather-widget'>
            {isDayTime ? <div className='sun'></div> : <MoonSVG className='moon'/>}
            <div className='cloud-container'>
                {cloudSize > 50 && <CloudSVG className='cloud'/>}
            </div>
            <div className='temperature'>{Math.round(weatherData.main.temp)}°</div>
            <div className='weather'>{weatherData.weather[0].main}</div>
            <div className='low-high'>{Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°</div>
            <div className='feels-like'>Feels Like {Math.round(weatherData.main.feels_like)}°</div>
            <div className='location'>{weatherData.name}</div>
            <div className='humidity'>Humidity: {weatherData.main.humidity}</div>
        </div>
    );
}

export default WeatherWidget;