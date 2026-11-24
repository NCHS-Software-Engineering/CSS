"use client";
import { useState, useEffect } from "react";
import { FStyleGuide, SvLayoutWidgetList, WeatherData } from "./server/server";
import { PName } from "./types/PName";
import { Sched } from "./types/Sched";
import Count from "./wid/Count";
import { Props } from "./types/Props";
import RTC from "./wid/RTC";
import Dates from "./wid/Dates";
import PdNm from "./wid/PdNm";
import Weather from "./wid/Weather";
import Txbox from "./wid/Txbox";
import Time from "./comp/Time";
import { Modal, Paper, TextField, Button, Divider } from "@mui/material";
import { Box } from "@mui/system";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { cookieMap, fmtRoute } from "./sv";
import { Config } from "./types/Config";

interface ServerMessage {
    schedule: Sched[];
    widget: SvLayoutWidgetList[];
    weather: WeatherData;
}

export default function Home() {
    const [room, setRoom] = useState("");
    const [peekLay, setPeek] = useState<FStyleGuide>();
    const searchParams = useSearchParams();
    async function initRoom(param: ReadonlyURLSearchParams) {
        if(param.has("room")) return param.get("room")!;
        if(!(await cookieMap.json("hascookie")).result) return;
        const res = (await cookieMap.json("getroomcookie")).message;
        if(typeof res == "string") return;
        return param.get("room") ?? res.room;
    }
    useEffect(() => {
        if(room.length) return;
        (async () => {
            const res = await initRoom(searchParams);
            if(res) setRoom(res);
        })();
    }, [room, searchParams]);
    const [ovr, setOvr] = useState(false);
    const [sched, setSched] = useState<Sched[]>([]);
    const [cd, setCD] = useState(0);
    const [prdNm, setPrdNm] = useState<PName>();
    const [wid, setWid] = useState<SvLayoutWidgetList[]>([]);
    useEffect(() => {
        const port = 8000;
        const svURL = "ws://" + window.location.hostname + ":" + port;
        const ws = new WebSocket(svURL);
        ws.addEventListener("open", () => {
            ws.send(room);
        });
        ws.addEventListener("message", (e) => {
            const d: ServerMessage = JSON.parse(e.data);
            setSched(d.schedule);
            setWid(d.widget);
        });
        return () => ws.close();
    }, [room]);
    useEffect(() => {
        (async () => {
            const res = await fmtRoute.json("peek", { room });
            if(typeof res.message == "string") return;
            setPeek(res.message as FStyleGuide);
        })();
    }, [room]);
    useEffect(() => {
        if(!window) return;
        const e = (e: KeyboardEvent) => {
            if(!ovr && e.code == "Escape") setOvr(false);
        }
        window.addEventListener("keydown", e);
        return () => window.removeEventListener("keydown", e);
    }, [ovr]);
    function renderWidget(w: SvLayoutWidgetList, i: number) {
        const props = { ...w.props, id: String(i) };
        switch(w.type) {
            case "count":
                return <Count key={i} {...props} config={{ ...props.config, dsSecs: props.config.dsSecs ?? false }} delta={cd} prdNm={prdNm}/>;
            case "rtc":
                return <RTC key={i} {...props}/>;
            case "date":
                return <Dates key={i} {...props}/>;
            case "pdnm":
                return <PdNm key={i} {...props} periodName={prdNm}/>;
            case "weather":
                return <Weather key={i} {...props}/>;
            case "txbox": {
                const text = props.text ?? props.config.text;
                if(!text) {
                    console.error(`Textbox widget at index ${i} is missing its text`);
                    return null;
                }
                return <Txbox key={i} {...props} text={text}/>;
            }
            default:
                console.error(`Unsupported widget type received: ${w.type}`);
                return null;
        }
    }
    return <div>
        <Time schedule={sched} countdownCallback={(d) => setCD(d)} periodNameCallback={(d) => setPrdNm(d)}/>
        {wid.map(renderWidget)}
        <Modal sx={{ display: "flex", alignItems: "center", justifyContent: "center", overflowY: "scroll" }} open={ovr} onClose={() => setOvr(false)}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "14cm", maxWidth: "90%" }}>
                <Paper elevation={7} sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 1, width: "100%" }}>
                    {peekLay &&
                        ("img" in peekLay ? <img width="100%" height="100%" src={peekLay.img}/> : <></>) && 
                        ("color" in peekLay ? <div style={{ width: "100%", height: "100%", backgroundColor: peekLay.color }}/> : <></>)
                    }
                    <TextField variant="filled" label="Room Name" value={room} onInput={(e) => setRoom((e.target as HTMLInputElement).value)}/>
                    <Button sx={{ marginTop: 1 }} variant="contained" size="large" onClick={async () => await cookieMap.json("signroomcookie", { room })}>Save</Button>
                    <Divider sx={{ marginTop: 2, marginBottom: 1, width: "100%" }}/>
                    <footer>
                        <p>Original by Michael Mihailov (2025), Eric Gu (2024), Nick Patel (2025), & Nicole Liang (2024)</p>
                        <p>Rework by Zach Hoersten, Ben Goldstein & Evan Hader</p>
                    </footer>
                </Paper>
            </Box>
        </Modal>
    </div>
}