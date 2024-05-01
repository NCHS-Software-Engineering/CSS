import React, {useState, useEffect} from "react";
import ScaleText from "../components/ScaleText";
import { Paper } from "@mui/material";

// --- various SVGs (START) ---

const SUN = (
    <svg width="100%" height="100%">
        <defs>
            <radialGradient id="radialGradient">
                <stop offset="0%" stopColor="#ffaa00"/>
                <stop offset="90%" stopColor="#ff8000"/>
            </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="32%" fill="url('#radialGradient')" stroke="#000000" strokeWidth="2%"/>
    </svg>
);

const MOON = (
    <svg width="100%" height="100%" viewBox="-9.411 -9.411 49.279 47.279"> {/* original viewbox = 0 0 30.457 30.457 */}
        <defs>
            <radialGradient id="radialGradient">
                <stop offset="0%" stopColor="#97b0cf"/>
                <stop offset="45%" stopColor="#a7c0df"/>
                <stop offset="90%" stopColor="#d0e5ff"/>
            </radialGradient>
        </defs>
        <path fill="url('#radialGradient')" stroke="#000000" strokeWidth="2%"
            d="M29.693,14.49c-0.469-0.174-1-0.035-1.32,0.353c-1.795,2.189-4.443,3.446-7.27,3.446c-5.183,0-9.396-4.216-9.396-9.397
            c0-2.608,1.051-5.036,2.963-6.835c0.366-0.347,0.471-0.885,0.264-1.343c-0.207-0.456-0.682-0.736-1.184-0.684
            C5.91,0.791,0,7.311,0,15.194c0,8.402,6.836,15.238,15.238,15.238c8.303,0,14.989-6.506,15.219-14.812
            C30.471,15.118,30.164,14.664,29.693,14.49z"
        />
    </svg>
);

// NOTE: this svg is currently useless
const CLOUD = (
    <svg width="100%" height="100%" viewBox="0 -960 960 960">
        <defs>
            <linearGradient id="linearGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#eeeeff"/>
                <stop offset="100%" stopColor="#aaaabb"/>
            </linearGradient>
        </defs>
        <path fill="url('#linearGradient')" stroke="#000000" strokeWidth="2%"
            d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Z"
        />
    </svg>
);

// --- various SVGs (END) ---


// TODO: figure out how to determine cloudiness
function WeatherWidget(props = null) // props.id, props.col, props.row, props.width, props.height, props.config, props.weatherData
{
    const [weatherData, setWeatherData] = useState(null);

    const [col, setCol] = useState(1);
    const [row, setRow] = useState(1);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [config, setConfig] = useState({});

    useEffect(() => {
        setWeatherData(props.weatherData);
        setCol(props.col + 1);
        setRow(props.row + 1);
        setWidth(props.width);
        setHeight(props.height);
        setConfig(props.config);
    }, [props]);

    if(!weatherData) return (
        <Paper elevation={20}
            style=
            {{
                backgroundColor: config.backgroundColor,
                color: config.textColor,
                "gridColumnStart": col,
                "gridColumnEnd": col+width,
                "gridRowStart": row,
                "gridRowEnd": row+height,
                "borderRadius": 20,
                overflow: "hidden",

                textAlign: "center"
            }}
        >
            Loading...
        </Paper>
    );

    return (
        <Paper elevation={20}
            style=
            {{
                backgroundColor: config.backgroundColor,
                color: config.textColor,
                "gridColumnStart": col,
                "gridColumnEnd": col+width,
                "gridRowStart": row,
                "gridRowEnd": row+height,
                "borderRadius": 20,
                overflow: "hidden"
            }}
        >
            <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden"}}>
                <div style={{height: "35%", display: "flex", justifyContent: "center"}}>
                    <div style={{position: "relative", aspectRatio: 1/1, maxWidth: "100%", maxHeight: "100%"}}>
                        <div style={{position: "absolute", width:"60%", height:"60%", left: "10%", top: "35%"}}>
                            {(weatherData.skyCover >= 37.5) ? CLOUD : <></>}
                        </div>
                        {weatherData.isDaytime ? SUN : MOON}    
                    </div>
                </div>
                <div style={{height: "65%", paddingBottom: "1%"}}>
                    <div style={{height: "50%"}}>
                        <ScaleText id={props.id + "temperature"} text={weatherData.temperature + "°"} portionFilled={0.9} width={width} height={height * 0.5}/>
                    </div>
                    <div style={{height: "15%"}}>
                        <ScaleText id={props.id + "shortForecast"} text={weatherData.shortForecast} portionFilled={0.6} width={width} height={height * 0.15}/>
                    </div>
                    <div style={{height: "20%"}}>
                        <ScaleText id={props.id + "Location"} text={"Naperville"} width={width} portionFilled={0.7} height={height * 0.2}/>
                    </div>
                    <div style={{height: "15%"}}>
                        <ScaleText id={props.id + "Humidity"} text={"Humidity: " + weatherData.relativeHumidityValue + "%"} portionFilled={0.7} width={width} height={height * 0.15}/>
                    </div>
                </div>
            </div>
        </Paper>
    );
}

export default WeatherWidget;