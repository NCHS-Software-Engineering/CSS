import React from "react";
import './index.css';

import axios from 'axios';

import { ReactComponentElement as MoonSVG} from '../../assets/svgs/dark_mode_FILL1_wght400_GRAD0_opsz24.svg'
import { ReactComponentElement as CloudSVG} from '../../assets/svgs/cloudy_FILL1_wght400_GRAD0_opsz24.svg'

const WeatherWidget = ({location}) => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        if(location.length){
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`)
        }
    } , [location]);
    return (
        <div className='weather-widget'>
            <MoonSVG className='moon'/>
            <div className='cloud-container'>
                <CloudSVG className='cloud'/>
            </div>
            <div className='temperature'>temperature</div>
            <div className='weather'>weather</div>
            <div className='low-high'>low-high</div>
            <div className='feels-like'>feels-like</div>
            <div className='location'>{location}</div>
            <div className='humidity'>humidity</div>
        </div>
    );
}

export default WeatherWidget;