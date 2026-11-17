import { useEffect, useState } from "react";
import { Props } from "../types/Props";
import { WeatherData } from "../server/server";
import { map } from "../sv";
import PprST from "../defs/PprST";
import Ppr from "../defs/Ppr";
import ScText from "../comp/ScText";
import { PropElem } from "../types/PropElem";

const SVG = {
    sun: <svg width="100%" height="100%">
        <defs>
            <radialGradient id="rad">
                <stop offset="0%" stopColor="#ffaa00"/>
                <stop offset="90%" stopColor="#ff8000"/>
            </radialGradient>
        </defs>
        <circle cx="50%" cy="50%" r="32%" fill={`url("#rad")`} stroke="#000" strokeWidth="2%"/>
    </svg>,
    moon: <svg width="100%" height="100%" viewBox="-9.411 -9.411 49.279 47.279">
        <defs>
            <radialGradient id="rad">
                <stop offset="0%" stopColor="#97b0cf"/>
                <stop offset="45%" stopColor="#a7c0df"/>
                <stop offset="90%" stopColor="#d0e5ff"/>
            </radialGradient>
        </defs>
        <path fill={`url("#rad")`} stroke="#000" strokeWidth="2%" d="M29.693,14.49c-0.469-0.174-1-0.035-1.32,0.353c-1.795,2.189-4.443,3.446-7.27,3.446c-5.183,0-9.396-4.216-9.396-9.397
        c0-2.608,1.051-5.036,2.963-6.835c0.366-0.347,0.471-0.885,0.264-1.343c-0.207-0.456-0.682-0.736-1.184-0.684
        C5.91,0.791,0,7.311,0,15.194c0,8.402,6.836,15.238,15.238,15.238c8.303,0,14.989-6.506,15.219-14.812
        C30.471,15.118,30.164,14.664,29.693,14.49z"/>
    </svg>,
    cloud: <svg width="100%" height="100%" viewBox="0 -960 960 960">
        <defs>
            <linearGradient id="linearGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#eef"/>
                <stop offset="100%" stopColor="#aab"/>
            </linearGradient>
        </defs>
        <path fill={`url("#linearGradient")`} stroke="#000" strokeWidth="2%" d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Z"/>
    </svg>
} as const;
export default function Weather({ id, row, col, width, height, config }: Props): PropElem {
    // determine weather data by server query
    const [data, setData] = useState<WeatherData>();
    const [crow, setRow] = useState((row ?? 0) + 1);
    const [ccol, setCol] = useState((col ?? 0) + 1);
    const [cwidth, setWidth] = useState(width ?? 1);
    const [cheight, setHeight] = useState(height ?? 1);
    useEffect(() => {
        // no requery
        if(data) return;
        // send request via @beanthealien/net
        // (mapping defined in ../sv.ts)
        (async () => setData(await map.json("weather")));
    });
    if(!data) return <PprST props={{ row: crow, col: ccol, width: cwidth, height: cheight, config, id }} tx="Waiting for data..."/>
    return <Ppr props={{ row: crow, col: ccol, width: cwidth, height: cheight, config, id }}>
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden" }}>
            <div style={{ height: "35%", display: "flex", justifyContent: "center" }}>
                <div style={{ position: "absolute", width: "60%", height: "60%", left: "10%", top: "35%" }}>
                    {data.skyCover >= 37.5 ? SVG.cloud : null}
                </div>
                {data.isDaytime ? SVG.sun : SVG.moon}
            </div>
            <div style={{ height: "65%", paddingBottom: "1%" }}>
                <div style={{ height: "50%" }}>
                    <ScText id={id + "temperature"} text={data.temperature + "°"} portionFilled={0.9} width={cwidth} height={cheight * 0.5}/>
                </div>
                <div style={{ height: "15%" }}>
                    <ScText id={id + "shortForecast"} text={data.shortForecast} portionFilled={0.6} width={cwidth} height={cheight * 0.15}/>
                </div>
                <div style={{ height: "20%" }}>
                    <ScText id={id + "Location"} text={"Naperville"} width={cwidth} portionFilled={0.7} height={cheight * 0.2}/>
                </div>
                <div style={{ height: "15%" }}>
                    <ScText id={id + "Humidity"} text={"Humidity: " + data.relativeHumidity + "%"} portionFilled={0.7} width={cwidth} height={cheight * 0.15}/>
                </div>
            </div>
        </div>
    </Ppr>
}