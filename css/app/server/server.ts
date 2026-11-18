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
const format = client.from("format");
const event = client.from("event");

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
/**
 * @deprecated Replaced with users table.
 */
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
export interface WeatherData {
    isDaytime: boolean;
    shortForecast: string;
    relativeHumidity: number;
    skyCover: number;
    temperature: number;
}
var weather: WeatherData;
async function getCurrentWeather(callback: (data: WeatherData) => void) {
    try {
        const data: Partial<WeatherData> = {};
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
        data.temperature = hp.temperature;
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
                weather = data as WeatherData;
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
function sverr500(res: Response, error: Error) {
    return res.status(500).json({ success: false, message: error.message });
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
    if(error) return sverr500(res, error);
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
    if(error) return sverr500(res, error);
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
    // respond with 401 (Unauthorized)
    if(!validTk(req)) return unauth401(res);
    const { room, data: value }: RRoom & { data: T[] } = req.body;
    // assert contains
    const { data, error } = await sched.select().eq("room", room);
    if(error) return sverr500(res, error);
    // respond with 304 (Not Modified)
    if(data.length == 0) return res.status(304).json({ success: false, message: `No schedule for '${room}' exists (did you mean to create this resource?)` });
    const { error: err } = await sched.update({ schedule: { [key]: value } }).eq("room", room);
    if(err) return sverr500(res, err);
    // respond with 207 (Multi-Status)
    return res.status(207).json({ success: true, message: "Administred update" });
}
app.get("/admin/updateall", async (req, res) => {
    const list = await getRoomList();
    if(!list) return sverr500(res, new Error("Failed to receive rooms"));
    const pm = JSON.stringify(schedMap);
    for(const r of list) await getCurrentSchedule(r, (s) => {
        schedMap[r] = s;
        // can run the broadcast async
        broadcast(r);
    });
    // in case nothing changed
    // ensure correct response code
    // was administred
    // respond with 304 (Not Modified)
    // (original schedMap is the same as new map)
    // (still was a success, since we got the list and schedules)
    if(pm == JSON.stringify(schedMap)) return res.status(304).json({ success: true, message: "No rooms were updated" })
    // respond with 205 (Reset Content)
    // (note that 205 is not supposed to have)
    // (content in response, but we do anyway)
    // (https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/205)
    res.status(205).json({ success: true, message: "Updated rooms with new schedule" });
});
app.get("/admin/rooms", async (req, res) => {
    // respond with 401 (Unauthorized)
    if(!validTk(req)) return unauth401(res);
    const rooms = await getRoomList();
    if(!rooms) return sverr500(res, new Error("Failed to view rooms"));
    res.json({ success: true, message: rooms });
});
app.post("/admin/sched", async (req, res) => {
    return await svAdminPush<Sched>(req, res, "schedules");
});
app.post("/admin/defweek", async (req, res) => {
    return await svAdminPush(req, res, "defaultWeek");
});
app.post("/admin/cal", async (req, res) => {
    return await svAdminPush(req, res, "calendar");
});
async function rmExists(room: string) {
    return await sched.select().eq("room", room);
}
// put a room
app.post("/admin/put", async (req, res) => {
    if(!validTk(req)) return unauth401(res);
    const { room, schedule }: RRoom & { schedule?: Sched[] } = req.body;
    const sch = schedule ?? [];
    // verify not exists
    const { data, error } = await rmExists(room);
    if(error) return sverr500(res, error);
    // respond with 304 (Not Modified)
    if(data.length) return res.status(304).json({ success: false, message: `A room for '${room}' already exists (did you mean to update this resource?)` });
    const { error: err } = await sched.insert({ room, schedule: {
        schedules: sch,
        defaultWeek: {},
        calendar: {}
    } });
    if(err) return sverr500(res, err);
    // respond with 201 (Created)
    res.status(201).json({ success: true, message: `Put room '${room}' with schedule '${JSON.stringify(sch)}'` });
});
// drop a room
app.post("/admin/drop", async (req, res) => {
    if(!validTk(req)) return unauth401(res);
    const { room }: RRoom = req.body;
    const { data, error } = await rmExists(room);
    if(error) return sverr500(res, error);
    // respond with 404 (Not Found)
    if(!data.length) return res.status(404).json({ success: false, message: `No room exists for room '${room}'` });
    const { data: dat, error: err } = await sched.delete().eq("room", room).select();
    if(err) return sverr500(res, err);
    // if no rooms were dropped (shouldn't be possible)
    // respond with 412 (Precondition Failed)
    if(!dat.length) return res.status(412).json({ success: false, message: "Unexpected null-dropped rows" });
    // respond with 302 (Found)
    res.status(302).json({ success: true, message: `Discovered and dropped room '${room}'` });
    // also drop from schedMap and conMap
    delete schedMap[room];
    // (drop each, in case multiple)
    conMap[room].forEach(ws => ws.terminate());
    delete conMap[room];
});
// rename a room
app.post("/admin/ren", async (req, res) => {
    if(!validTk(req)) return unauth401(res);
    const { room, name }: RRoom & { name: string } = req.body;
    const { data, error } = await rmExists(room);
    if(error) return sverr500(res, error);
    if(!data.length) return res.status(404).json({ success: false, message: `No room exists for room '${room}'` });
    const { error: err } = await sched.update({ room: name }).eq("room", room);
    if(err) return sverr500(res, err);
    // respond with 205 (Reset Content)
    res.status(205).json({ success: true, message: `Room changed from '${room}' => '${name}'` });
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

app.get("/weather", (req, res) => {
    res.send({ weather });
});

// format routes
app.get("/format/peek", async (req, res) => {
    const { room }: RRoom = req.body;
    const { data, error } = await format.select().eq("room", room);
    if(error) return sverr500(res, error);
    res.json({ success: true, message: data });
});
interface StyleColor {
    style: { color: string };
}
interface StyleImg {
    style: { img: string };
}
interface StyleBoth {
    style: { color: string, bg: string };
}
type FStyleGuide = StyleBoth | StyleColor | StyleImg;
app.post("/format/put", async (req, res) => {
    const { room, style }: RRoom & (StyleBoth | StyleColor | StyleImg) = req.body;
    const { data, error } = await format.select().eq("room", room);
    if(error) return sverr500(res, error);
    // respond with 417 (Expectation Failed)
    if(!data.length) return res.status(417).json({ success: false, message: `No formats for '${room}' (did you meant to create this resource?)` });
    const { error: err } = await format.update({ room, ...style }).eq("room", room);
    if(err) return sverr500(res, err);
    // respond with 205 (Reset Content)
    res.status(205).json({ success: true, message: "Put new styles" });
});
app.post("/format/create", async (req, res) => {
    const { room, style }: RRoom & FStyleGuide = req.body;
    const { data, error } = await format.select().eq("room", room);
    if(error) return sverr500(res, error);
    // respond with 405 (Method Not Allowed)
    if(data.length) return res.status(405).json({ success: false, message: `Style already exists for '${room}' (did you mean to update this resource?)` });
    const { error: err } = await format.insert({ room, ...style });
    if(err) return sverr500(res, err);
    // respond with 201 (Created)
    res.status(201).json({ success: true, message: "Created style for room" });
});
app.post("/format/drop", async (req, res) => {
    const { room }: RRoom = req.body;
    const { data, error } = await format.select().eq("room", room);
    if(error) return sverr500(res, error);
    // respond with 404 (Not Found)
    if(!data.length) return res.status(404).json({ success: false, message: `Cannot find a style guide for '${room}'` });
    const { error: err } = await format.delete().eq("room", room);
    if(err) return sverr500(res, err);
    res.json({ success: true, message: `Dropped style guide for '${room}'` });
});

// event routes
app.get("/event/all", async (req, res) => {
    const { data, error } = await event.select();
    if(error) return sverr500(res, error);
    res.json({ list: data });
});
app.get("/event/at", async (req, res) => {
    const { index }: { index: number } = req.body;
    const { data, error } = await event.select().eq("id", index);
    if(error) return sverr500(res, error);
    // if the data is more than 1 (should not be possible)
    // respond with 409 (Conflict)
    if(data.length > 1) return res.status(409).json({ success: false, message: "Unexpected length of data more than 1" });
    // respond with 204 (No Content)
    if(!data.length) return res.status(204).json({ success: true, message: "No content to be displayed" });
    // respond with 302 (Found)
    res.json({ success: true, message: data });
});
app.get("/event/named", async (req, res) => {
    const { name }: { name: string } = req.body;
    const { data, error } = await event.select().eq("name", name);
    if(error) return sverr500(res, error);
    if(!data.length) return res.status(404).json({ success: true, message: "No content found for name" });
    res.json({ success: true, message: data });
});
app.post("/event/gen", async (req, res) => {
    const { name, time }: { name: string, time: string } = req.body;
    // time should be in ISO 8601 format
    // https://en.wikipedia.org/wiki/ISO_8601
    // YYYY-MM-DDTHH:mm:ssZ
    // otherwise, throw bad request
    if(time.length != 20) return res.status(400).json({ success: false, message: `Time of input '${time}' is not ISO 8601 (length '${time.length}' does not match expected length of 20)` });
    const { data, error } = await event.select().eq("name", name);
    if(error) return sverr500(res, error);
    if(data.length) return res.status(409).json({ success: false, message: "Existing event for name" });
    const { error: err } = await event.insert({ name, time });
    if(err) return sverr500(res, err);
    res.status(201).json({ success: true, message: "Created event" });
});
app.post("/event/drop", async (req, res) => {
    const { name }: { name: string } = req.body;
    const { data, error } = await event.select().eq("name", name);
    if(error) return sverr500(res, error);
    if(!data.length) return res.status(404).json({ success: false, message: `No event named '${name}' (did you mean to create this resource?)` });
    const { error: err } = await event.delete().eq("name", name);
    if(err) return sverr500(res, err);
    res.json({ success: true, message: "Dropped event for name" });
});

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});