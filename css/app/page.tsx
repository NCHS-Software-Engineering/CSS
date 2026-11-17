import Image from "next/image";
import { useState, useEffect } from "react";
import { WeatherData } from "./server/server";
import { PName } from "./types/PName";
import { Sched } from "./types/Sched";
import Count from "./wid/Count";

export default function Home() {
    const [room, setRoom] = useState("");
    let ovr = false;
    const [sched, setSched] = useState<Sched[]>([]);
    const [cd, setCD] = useState(0);
    const [prdNm, setPrdNm] = useState<PName>();
    const [wid, setWid] = useState<React.JSX.Element[]>([]);
    const [weather, setWeather] = useState<WeatherData>();
    const [disp, setDip] = useState<React.JSX.Element[]>();
    useEffect(() => {
        const port = 8000;
        const svURL = "ws://" + window.location.hostname + ":" + port;
        const ws = new WebSocket(svURL);
        ws.addEventListener("open", () => {
            ws.send(room);
        });
        ws.addEventListener("message", (e) => {
            const d = JSON.parse(e.data);
            setSched(d.schedule);
            setWid(d.widget);
            setWeather(d.weather);
            return () => ws.close();
        });
        return () => ws.close();
    }, [room]);
    useEffect(() => {
        const tds = [];
        for(let i = 0; i < wid.length; i++) {
            const w = wid[i];
            const typ = w.type;
            //
            if(typ == Count) tds.push(<Count id={String(i)} delta={cd} prdNm={prdNm} row={w.row} col={w.col} width={w.width} height={w.height} config={w.config}/>);
        }
    }, []);
}
