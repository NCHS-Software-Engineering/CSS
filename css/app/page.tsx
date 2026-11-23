"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React, { useState, useEffect, Attributes } from "react";
import { WeatherData } from "./server/server";
import { PName } from "./types/PName";
import { Sched } from "./types/Sched";
import Count from "./wid/Count";
import { PropElem } from "./types/PropElem";
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
import { cookieMap, map } from "./sv";

export default function Home() {
    const [room, setRoom] = useState("");
    const searchParams = useSearchParams();
    async function initRoom(param: ReadonlyURLSearchParams) {
        const res = (await cookieMap.json("getroomcookie")).message;
        if(typeof res == "string") {
            await cookieMap.json("signroomcookie");
            return await initRoom(param);
        }
        return param.get("room") ?? res.room;
    }
    useEffect(() => {
        if(room.length) return;
        (async () => {
            const res = await initRoom(searchParams);
            setRoom(res);
        })();
    }, [room, searchParams]);
    const [ovr, setOvr] = useState(false);
    const [sched, setSched] = useState<Sched[]>([]);
    const [cd, setCD] = useState(0);
    const [prdNm, setPrdNm] = useState<PName>();
    const [wid, setWid] = useState<PropElem[]>([]);
    const [weather, setWeather] = useState<WeatherData>();
    const [disp, setDip] = useState<PropElem[]>();
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
            //setWid(d.widget);
            setWeather(d.weather);
            return () => ws.close();
        });
        return () => ws.close();
    }, [room]);
    useEffect(() => {
        const tds: PropElem[] = [];
        for(let i = 0; i < wid.length; i++) {
            const w = wid[i];
            const typ = w.type;
            const serve = (func: React.ComponentType<any>, andProps?: Record<string, any>) => React.createElement(func, {
                id: String(i),
                row: w.props.row,
                col: w.props.col,
                width: w.props.width,
                height: w.props.height,
                config: w.props.config,
                ...andProps
            });
            if(typ == Count) tds.push(serve(Count, {
                delta: cd,
                prdNm
            }));
            else if(typ == RTC) tds.push(serve(RTC));
            else if(typ == Dates) tds.push(serve(Dates));
            else if(typ == PdNm) tds.push(serve(PdNm, { periodName: prdNm }));
            else if(typ == Weather) tds.push(serve(Weather));
            else if(typ == Txbox) tds.push(serve(Txbox, { text: (w as React.ReactElement<Required<Props> & { text: string }>).props.text }));
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDip(tds);
    }, []);
    useEffect(() => {
        if(!window) return;
        const e = (e: KeyboardEvent) => {
            if(!ovr && e.code == "Escape") setOvr(false);
        }
        window.addEventListener("keydown", e);
        return () => window.removeEventListener("keydown", e);
    }, []);
    return <div>
        <Time schedule={sched} countdownCallback={(d) => setCD(d)} periodNameCallback={(d) => setPrdNm(d)}/>
        {disp}
        <Modal sx={{ display: "flex", alignItems: "center", justifyContent: "center", overflowY: "scroll" }} open={ovr} onClose={() => setOvr(false)}>
            <Box sx={{ display: "flex", flexDirection: "column", width: "14cm", maxWidth: "90%" }}>
                <Paper elevation={7} sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 1, width: "100%" }}>
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