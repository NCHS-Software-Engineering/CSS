import * as supabase from "@supabase/supabase-js";
import * as bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";
import * as WebSocket from "ws";
import InvalidRoomReceivedError from "../errors/InvalidRoomReceivedError";
import { Sched } from "../types/Sched";
import { Database } from "../types/Database";
import UnexpectedResponseError from "../errors/UnexpectedResponseError";
import * as Schedule from "node-schedule";
config();

const secret = process.env.secret as string;

const app = express();
app.use(cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());
app.use(express.json());
const client = supabase.createClient<Database>(process.env.supabase_url as string, process.env.supabase_key as string);
// schedule table relationship
const sched = client.from("sched");
// id-auth table
const idAuth = client.from("id" as any);

// globals
const schedMap: Record<string, Sched[]> = {};
const conMap: Record<string, Set<WebSocket>> = {};
(async () => {
    const { error, data } = await sched.select();
    if(error) throw error;
    data.forEach((d, i) => {
        getCurrentSchedule(d.room, r => schedMap[d.room] = r);
    });
})();

// oauth
// i seperated callback
// to avoid ts thinking
// both could be undefined
async function checkValid(id: string, cb: (error?: Error, isValid?: boolean) => void) {
    const { error, data } = await idAuth.select().filter("id", "eq", id);
    if(error) return cb(error);
    cb(undefined, data.length != 0);
}
// lightweight helpers
const getRoom = async (room: string) => await sched.select().filter("room", "eq", room);
async function checkRoom(room: string) {
    // check if a room exists
    // should be jsonb
    // which contains:
    // scheudles
    // calendar
    // defaultWeek
    const { error, data } = await getRoom(room);
    if(error) throw error;
    if(!("schedules" in data[0] && "calendar" in data[0] && "defaultWeek" in data[0])) throw new InvalidRoomReceivedError(room, data[0]);
}
// adapted from server.js
async function getCurrentSchedule(room: string, callback: (result: Sched[]) => void) {
    const { error, data } = await getRoom(room);
    if(error) throw error;
    const { calendar, schedules, defaultWeek } = data[0].schedule as Record<string, any>;
    let dk;
    let sk;
    const __dk = () => date.getMonth() * 100 + date.getDate();
    const date = new Date();
    dk = __dk();
    if(calendar[dk]) {
        sk = calendar[dk]["schedule"];
    } else {
        sk = defaultWeek[date.getDay()];
    }
    let res = schedules[sk];
    res = res ?? [];
    callback(res);
    date.setDate(date.getDate() - 1);
    dk = __dk();
    if(calendar[dk] && !calendar[dk].repeating) {
        // drop calendar[dk]
        delete calendar[dk];
        await sched.select().filter("room", "eq", room).update({ ...data[0], calendar });
    }
}

const port = process.env.PORT ?? 3001;
const wss = new WebSocket.WebSocketServer({ port: 8000 });
async function broadcast(room: string) {
    if(room in conMap) {
        conMap[room].forEach(w => updateClient(w, room));
    }
}
async function updateClient(ws: WebSocket, room: string) {
    ws.send(JSON.stringify({ schedule: schedMap[room] }));
}
interface Weather {
    isDaytime: boolean;
    shortForecast: string;
    relativeHumidity: number;
    skyCover: number;
}
var weather: Weather;
async function getCurrentWeather(callback: (data: Weather) => void) {
    try {
        const data: Partial<Weather> = {};
        const res = await fetch("https://api.weather.gov/points/41.7676,-88.157");
        if(!res.ok) throw new UnexpectedResponseError(res.status);
        const json = await res.json();
        const linkData = await fetch(json.properties.forecastHourly);
        if(!linkData.ok) throw new UnexpectedResponseError(linkData.status);
        const hour = await linkData.json();
        if(!hour.properties) return console.error("Error when fetching weather (in hourly data)");
        const hp = hour.properties.periods[0];
        data.isDaytime = hp.isDaytime;
        data.shortForecast = hp.shortForecast;
        data.relativeHumidity = hp.relativeHumidity.value;
        const fgrid = await fetch(hour.properties.forecastGridData);
        if(!fgrid.ok) throw new UnexpectedResponseError(fgrid.status);
        const gdata = await fgrid.json();
        if(!gdata.properties) return console.error("Error when fetching weather (in grid data)");
        const date = new Date();
        const hr = date.getHours();
        // chicago is UTC-5
        const off = -5;
        const cr = date.getDate();
        for(const cc of gdata.properties.skyCover.values) {
            const v = cc.validTime;
            const [cd, ch, cs] = [[8, 10], [11, 13], [v.indexOf("PT") + 2, v.indexOf("H")]].map(x => Number(v.slice(x[0], x[1])));
            const hc = ch + ((cd - cr) * 24) + off;
            if(hr < hc + cs && hc <= hr) {
                data.skyCover = cc.value;
                weather = data as Weather;
                callback(weather);
            }
        }
    } catch(e) {
        console.error(e);
    }
}
function createJob<T>(callback: (value: T) => void) {
    //
}

wss.on("connection", (ws) => {
    let first = false;
    let room: string;
    ws.on("message", (msg) => {
        if(first) return;
        first = true;
        try {
            room = msg.toString();
            if(!schedMap[room]) {
                updateClient(ws, room);
                ws.terminate();
            } else {
                conMap[room] = conMap[room] ?? new Set();
                conMap[room].add(ws);
                updateClient(ws, room);
            }
        } catch(e) {
            ws.terminate();
            console.error(e);
        }
    });
    ws.on("close", () => {
        if(room) {
            if(conMap[room]) {
                // remove client
                conMap[room].delete(ws);
                // if set is empty
                // then delete room from
                // connections map
                // (works because)
                // (!0 is true)
                if(!conMap[room].size) delete conMap[room];
            }
        }
    });
});
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});