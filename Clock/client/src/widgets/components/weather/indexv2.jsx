import React, {useState, useEffect} from "react";
import './index.css';

import {ReactComponent as MoonSVG} from '../../assets/svgs/dark_mode_FILL1_wght400_GRAD0_opsz24.svg'
import {ReactComponent as CloudSVG} from '../../assets/svgs/cloud_FILL1_wght400_GRAD0_opsz24.svg'

function WeatherWidget(props = null) // props.weatherData
{
    const [weatherData, setWeatherData] = useState(null);
    const [col, setCol] = useState(1);
    const [row, setRow] = useState(1);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);

    useEffect(() => {
        if (!props) return;
        if (props.weatherData) setWeatherData(props.weatherData);
        setCol(props.col + 1);
        setRow(props.row + 1);
        setWidth(props.width);
        setHeight(props.height);

        // console.log("hello", props.weatherData);
    }, [props]);

    if(!weatherData) return <div>Loading...</div>

    const isDayTime = weatherData.isDaytime

    return (
        <div className='weather-widget'
            style=
            {{
                "gridColumnStart": col,
                "gridColumnEnd": col+width,
                "gridRowStart": row,
                "gridRowEnd": row+height
            }}
        >
            {isDayTime ? <div className='sun'></div> : <MoonSVG className='moon'/>}
            <div className='cloud-container'>
                {(weatherData.shortForecast === "Mostly Cloudy" || weatherData.shortForecast === "Partly Cloudy") && <CloudSVG className='cloud'/>}
            </div>
            <div className='temperature'>{weatherData.temperature}°F</div>
            <div className='weather'>{weatherData.shortForecast}</div>
            <div className='location'>Naperville</div>
            <div className='precipitation'>Precipitation: {weatherData.probabilityOfPrecipitation.value}%</div>
            <div className='humidity'>Humidity: {weatherData.relativeHumidity.value}%</div>
            <div className='wind-speed'>Wind Speed: {weatherData.windSpeed}</div>
        </div>
    );
}

export default WeatherWidget;