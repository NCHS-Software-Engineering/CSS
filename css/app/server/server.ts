/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
import * as supabase from "@supabase/supabase-js";
import * as bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";
import InvalidRoomReceivedError from "../errors/InvalidRoomReceivedError";
import { Sched } from "../types/Sched";
import { Database, Json } from "../types/Database";
import UnexpectedResponseError from "../errors/UnexpectedResponseError";
import * as Schedule from "node-schedule";
import { WebSocketServer, WebSocket } from "ws";
import { randomBytes } from "crypto";
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
const users = client.from("users");

// globals
const schedMap: Record<string, Sched[]> = {};
const conMap: Record<string, Set<WebSocket>> = {};
(async () => {
    const { error, data } = await sched.select();
    if(error) throw error;
    data.forEach((d) => {
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
const getRoom = async (room: string) => await sched.select().eq("room", room);
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
        await sched.update({ schedule: {
            schedules,
            defaultWeek,
            calendar
        } }).eq("room", room);
    }
}

const port = process.env.PORT ?? 3001;
const wss = new WebSocketServer({ port: 8000 });
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
async function getRoomList() {
    return (await sched.select()).data?.map(x => x.room);
}
Schedule.scheduleJob("0 0 * * *", async () => {
    const rm = await getRoomList();
    if(rm) {
        for(let i = 0; i < rm.length; i++) await getCurrentSchedule(rm[i], (s) => {
            schedMap[rm[i]] = s;
            broadcast(rm[i]);
        });
    }
});
Schedule.scheduleJob("30 * * * *", async () => {
    const rm = await getRoomList();
    if(rm) {
        // do once; don't do for each
        await getCurrentWeather(() => {});
        rm.forEach(broadcast);
    }
});

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

async function __getSched(req: Request, res: Response, field: string) {
    const { room }: RRoom = req.body;
    const { error, data } = await getRoom(room);
    if(error) return res.status(500).json({ success: false, message: error.message });
    return res.json({ success: true, message: (data[0].schedule as Record<string, any>)[field] });
}
interface RRoom {
    room: string;
}
// TODO: auth subsys
// also install @BeanTheAlien/netmap
// and apply sv net file

function decode(jwtString: string) {
    return jwt.verify(jwtString, secret);
}
function getUser(req: Request) {
    return decode(req.cookies.token);
}
function validTk(req: Request) {
    return !!getUser(req);
}
function signTk(res: Response, token: string) {
    res.cookie("token", token, {
        // 2-week lifespan
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: true
    });
}

interface UserInfo {
    name: string;
    password: string;
}
async function findUsr(name: string) {
    return (await users.select().eq("name", name)).data?.[0];
}
async function hasUsr(name: string) {
    return !!(await findUsr(name));
}
function genTk() {
    return jwt.sign({ token: randomBytes(32).toHex() }, secret);
}
// user subsystem
// signup
app.post("/user/signup", async (req, res) => {
    const { name, password }: UserInfo = req.body;
    // if a user exists, throw 409 (Conflict)
    // (prior to insert throwing on unique)
    if(await hasUsr(name)) return res.status(409).json({ success: false, message: `A user with the name '${name}' already exists` });
    const token = genTk();
    const { error } = await users.insert({ name, password: bcrypt.hashSync(password, 10), token });
    if(error) return res.status(500).json({ success: false, message: error.message });
    signTk(res, token);
    // 201 (Created)
    res.status(201).json({ success: true, message: "Successfully signed up" });
});
// signin
app.post("/user/signin", async (req, res) => {
    const { name, password }: UserInfo = req.body;
    const usr = await findUsr(name);
    // respond with 417 (Expectation Failed)
    if(!usr) return res.status(417).json({ success: false, message: `No user exists with the name '${name}'` });
    // respond with 406 (Not Acceptable)
    if(!bcrypt.compareSync(usr.password, password)) return res.status(406).json({ success: false, message: `Password could not be verified to match real password` });
    const token = genTk();
    const { error } = await users.update({ token }).eq("name", name);
    if(error) return res.status(500).json({ success: false, message: error.message });
    signTk(res, token);
    // respond with 202 (Accepted)
    res.status(202).json({ success: true, message: "Accepted signin" });
});

function unauth401(res: Response) {
    return res.status(401).json({ success: false, message: "Request does not contain a valid 'token' cookie"});
}
// admin routes
// (auth required)
async function svAdminPush<T extends Json>(req: Request, res: Response, key: string) {
    const { room, data: value }: RRoom & { data: T[] } = req.body;
    // assert contains
    const { data, error } = await sched.select().eq("room", room);
    if(error) return res.status(500).json({ success: false, message: error.message });
    // respond with 304 (Not Modified)
    if(data.length == 0) return res.status(304).json({ success: false, message: `No schedule for '${room}' exists (did you mean to create this resource?)` });
    const { error: err } = await sched.update({ schedule: { [key]: value } }).eq("room", room);
    if(err) return res.status(500).json({ success: false, message: err.message });
    // respond with 207 (Multi-Status)
    return res.status(207).json({ success: true, message: "Administred update" });
}
app.get("/admin/rooms", async (req, res) => {
    // respond with 401 (Unauthorized)
    if(!validTk(req)) return unauth401(res);
    const rooms = await getRoomList();
    if(!rooms) return res.status(500).json({ success: false, message: "Failed to view rooms" });
    res.json({ success: true, message: rooms });
});
app.post("/admin/schedule", async (req, res) => {
    const { room }: RRoom & { schedule: Sched[] } = req.body;
});

// public routes
app.get("/sched", async (req, res) => {
    return await __getSched(req, res, "schedules");
});
app.get("/defweek", async (req, res) => {
    return await __getSched(req, res, "defaultWeek");
});
app.get("/cal", async (req, res) => {
    return await __getSched(req, res, "calendar");
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});