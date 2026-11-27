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
import { randomBytes, randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { Config } from "../types/Config";
import { Props } from "../types/Props";
config();

/**
 * TODO:
 * - add nodemailer request admins for signing up user (no auto-signup)
 * - add verify user to be able to signup a user
 * - ~change name => email in user table~
 * - ~deprecate and remove idAuth (cuz it will prolly error)~
 */

const secret = process.env.secret!;

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());
app.use(express.json());
const client = supabase.createClient<Database>(process.env.supabase_url!, process.env.supabase_key!);
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.nodemailer_user!,
        pass: process.env.nodemailer_pass!
    }
});
// schedule table relationship
const sched = client.from("sched");
// id-auth table
// const idAuth = client.from("id" as any);
const users = client.from("users");
const format = client.from("format");
const event = client.from("event");
const esc = client.from("req");

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
/*
async function checkValid(id: string, cb: (error?: Error, isValid?: boolean) => void) {
    const { error, data } = await idAuth.select().filter("id", "eq", id);
    if(error) return cb(error);
    cb(undefined, data.length != 0);
}
*/
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
export interface SvLayoutWidgetList {
    type: "count" | "date" | "pdnm" | "rtc" | "txbox" | "weather";
    props: Props & {
        text?: string;
        config: Config & {
            dsSecs?: boolean;
            text?: string;
        };
    };
}
async function updateClient(ws: WebSocket, room: string) {
    // NOTE: current response includes generic response
    // (sake of intellisense support)
    const then = (wid: SvLayoutWidgetList) => wid;
    ws.send(JSON.stringify({ schedule: schedMap[room], weather, widget: [
        then({
            type: "date",
            props: {
                id: randomUUID(),
                row: 8,
                col: 7,
                width: 2,
                height: 1,
                config: {
                    bg: "#000",
                    txClr: "#5200ff"
                }
            }
        }),
        then({
            type: "weather",
            props: {
                id: randomUUID(),
                row: 3,
                col: 9,
                width: 3,
                height: 5,
                config: {
                    bg: "#9ca0ff",
                    txClr: "#fff"
                }
            }
        }),
        then({
            type: "pdnm",
            props: {
                id: randomUUID(),
                row: 1,
                col: 1,
                width: 14,
                height: 1,
                config: {
                    bg: "#ff5858",
                    txClr: "#fff"
                }
            }
        }),
        then({
            type: "txbox",
            props: {
                id: randomUUID(),
                row: 3,
                col: 13,
                width: 2,
                height: 4,
                config: {
                    bg: "#fff",
                    txClr: "#000",
                    text: "hello biden"
                }
            }
        }),
        then({
            type: "count",
            props: {
                id: randomUUID(),
                row: 6,
                col: 1,
                width: 7,
                height: 2,
                config: {
                    bg: "#a46f6f",
                    txClr: "#000",
                    dsSecs: true
                }
            }
        }),
        then({
            type: "rtc",
            props: {
                id: randomUUID(),
                row: 3,
                col: 1,
                width: 7,
                height: 2,
                config: {
                    bg: "#5cc4ff",
                    txClr: "#000"
                }
            }
        })
    ] }));
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
        // 1. Fetch points data
        const res = await fetch("https://api.weather.gov/points/41.7676,-88.157");
        if(!res.ok) throw new UnexpectedResponseError(res.status);
        const json = await res.json();
        // 2. Fetch hourly forecast
        const linkData = await fetch(json.properties.forecastHourly);
        if(!linkData.ok) throw new UnexpectedResponseError(linkData.status);
        const hour = await linkData.json();
        if(!hour.properties) return console.error("Error when fetching weather (in hourly data)");
        const hp = hour.properties.periods[0];
        data.isDaytime = hp.isDaytime;
        data.shortForecast = hp.shortForecast;
        data.relativeHumidity = hp.relativeHumidity.value;
        data.temperature = hp.temperature;
        // 3. Fix: Fetch grid data from json.properties (points response), not hour
        const fgrid = await fetch(json.properties.forecastGridData);
        if(!fgrid.ok) throw new UnexpectedResponseError(fgrid.status);
        const gdata = await fgrid.json();
        if(!gdata.properties) return console.error("Error when fetching weather (in grid data)");
        const now = new Date().getTime();
        // 4. Robust time interval matching using standard ISO parsing
        for(const cc of gdata.properties.skyCover.values) {
            const [timePart, durationPart] = cc.validTime.split("/");
            const startTime = new Date(timePart).getTime(); 
            // Extract hours from ISO duration (e.g., "PT1H" -> 1)
            const match = durationPart?.match(/PT(\d+)H/);
            const hours = match ? parseInt(match[1], 10) : 1;
            const endTime = startTime + hours * 3600 * 1000;
            if(now >= startTime && now < endTime) {
                data.skyCover = cc.value;
                // FIX: don't define new const
                // weather (overshadow)
                // (global weather var)
                weather = data as WeatherData;
                callback(weather);
                break;
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

function decode(jwtString: string) {
    return jwt.verify(jwtString, secret);
}
function getUser(req: Request) {
    return decode(req.cookies.token);
}
function validTk(req: Request) {
    return !!getUser(req);
}
function cookie(res: Response, key: string, value: string) {
    res.cookie(key, value, {
        // 8-week lifespan
        maxAge: 8 * 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: true
    });
}
function signTk(res: Response, token: string) {
    cookie(res, "token", token);
}
function signRoom(res: Response, room: string) {
    cookie(res, "room", room);
}

interface UserInfo {
    email: string;
    password: string;
}
async function findUsr(email: string) {
    return (await users.select().eq("email", email)).data?.[0];
}
async function hasUsr(name: string) {
    return !!(await findUsr(name));
}
function genTk(time: jwt.SignOptions["expiresIn"] = "8W") {
    // FIX: no .toHex() method
    return jwt.sign({ token: randomBytes(32).toString("hex") }, secret, { expiresIn: time });
}
function sverr500(res: Response, error: Error) {
    return res.status(500).json({ success: false, message: error.message });
}
// --- UPDATE THIS TO INCLUDE MORE ONLY-ROUTE-TO ADDRESSES ---
type __AuthEmailStubs = "goldstein" | "hoersten" | "hader" | "drop";
export type OnlyRouteTo = __AuthEmailStubs | __AuthEmailStubs[];
// user subsystem
// signup
app.all("/user/signup", async (req, res) => {
    const { email, password, only }: UserInfo & { only?: OnlyRouteTo } = req.body;
    // if a user exists, throw 409 (Conflict)
    // (prior to insert throwing on unique)
    if(await hasUsr(email)) return res.status(409).json({ success: false, message: `A user with the name '${email}' already exists` });
    // short-life token
    const token = genTk("3H");
    const coreURI = "https://placeholder.com/admin/escalate?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&token=${encodeURIComponent(token)}";
    // if the 'drop' value is included
    // then intentionally break
    // (drop request before further action is taken)
    if(only && (only == "drop" || only.includes("drop"))) return res.json({ success: true, message: "Signup request intentionally dropped" });
    // escalate and request signup verification
    // FIX: don't send to the signup-er
    // FIX: use 'html' to send HTML ('text' sends plaintext)
    // FIX: correct from address (and set my email as the actual sender)
    // this is the primary admin
    // (who sent the message and who will receive responses?)
    const primaryAdmin = "ben.allen.goldstein@gmail.com";
    const authAdmins = [primaryAdmin, "zthoersten@stu.naperville203.org", "emhader@stu.naperville203.org"];
    // the 'only' property defines specific admins to route to
    // before sending, create new send list that filters
    // for emails included in 'only' (if it exists)
    const final = !only ? authAdmins : authAdmins.filter(x => Array.isArray(only) ? only.some(y => x.includes(y)) : x.includes(only));
    const mail = await transport.sendMail({
        to: final,
        from: "No-Reply <noreply@clock.redhawks.us>",
        sender: primaryAdmin,
        replyTo: primaryAdmin,
        subject: `User ${email} Wants To Sign Up!`,
        html: `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
                <td align="center" style="background-color: #16a4e6; padding: 16px; border-radius: 15px; font-family: Helvetica, Arial, sans-serif; text-align: center;">
                <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: bold;">User ${email} Wants To Sign Up!</h1>
                <p style="margin: 0 0 10px 0; font-size: 16px;">User with email ${email} wants to sign up.</p>
                <p style="margin: 0 0 10px 0; font-size: 16px;">Request Token: ${token.slice(0, 11)}...</p>
                <p style="margin: 0 0 10px 0; font-size: 16px;">Click <a href="${coreURI}&method=accept" style="font-weight: bold; text-decoration: underline;">here</a> to permit the signup.</p>
                <p style="margin: 0; font-size: 16px;">Or click <a href="${coreURI}&method=deny" style="font-weight: bold; text-decoration: underline;">here</a> to deny the signup.</p>
                <p style="margin-top: 20px; font-size: 10px; color: #737373;">This is an automatic email. Responses will be forwarded to '${primaryAdmin}'.</p>
                </td>
            </tr>
        </table>`
    });
    // respond with 418 (I'm a teapot)
    if(mail.rejectedErrors) return res.status(418).json({ success: false, message: `Failed to send mail: ${JSON.stringify(mail.rejectedErrors.map(v => JSON.stringify(v)))}`, maildata: {
        emailAccept: mail.accepted,
        emailReject: mail.rejected,
        response: mail.response
    } });
    const { error } = await esc.insert({ email, password: bcrypt.hashSync(password, 10), token });
    if(error) return sverr500(res, error);
    // 201 (Created)
    res.status(201).json({ success: true, message: "Successfully signed up" });
});
// signin
app.all("/user/signin", async (req, res) => {
    const { email, password }: UserInfo = req.body;
    const usr = await findUsr(email);
    // respond with 417 (Expectation Failed)
    if(!usr) return res.status(417).json({ success: false, message: `No user exists with the name '${email}'` });
    // respond with 406 (Not Acceptable)
    if(!bcrypt.compareSync(usr.password, password)) return res.status(406).json({ success: false, message: `Password could not be verified to match real password` });
    const token = genTk();
    const { error } = await users.update({ token }).eq("email", email);
    if(error) return sverr500(res, error);
    signTk(res, token);
    // respond with 202 (Accepted)
    res.status(202).json({ success: true, message: "Accepted signin" });
});
// validate token
app.all("/user/amok", async (req, res) => {
    res.send({ ok: validTk(req) });
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
app.all("/admin/updateall", async (req, res) => {
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
app.all("/admin/rooms", async (req, res) => {
    // respond with 401 (Unauthorized)
    if(!validTk(req)) return unauth401(res);
    const rooms = await getRoomList();
    if(!rooms) return sverr500(res, new Error("Failed to view rooms"));
    res.json({ success: true, message: rooms });
});
app.all("/admin/sched", async (req, res) => {
    return await svAdminPush<Sched>(req, res, "schedules");
});
app.all("/admin/defweek", async (req, res) => {
    return await svAdminPush(req, res, "defaultWeek");
});
app.all("/admin/cal", async (req, res) => {
    return await svAdminPush(req, res, "calendar");
});
async function rmExists(room: string) {
    return await sched.select().eq("room", room);
}
// put a room
app.all("/admin/put", async (req, res) => {
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
app.all("/admin/drop", async (req, res) => {
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
app.all("/admin/ren", async (req, res) => {
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
app.all("/admin/escalate", async (req, res) => {
    if(!validTk(req)) return unauth401(res);
    const { email, password, token, method }: UserInfo & { token: string, method: "accept" | "deny" } = req.body;
    // validate escalation
    const { data, error } = await esc.select().eq("email", email);
    if(error) return sverr500(res, error);
    if(!data.length) return res.status(400).json({ success: false, message: "No escalated user found" });
    const tv = jwt.verify(data[0].token, secret);
    const tv2 = jwt.verify(token, secret);
    if(!tv || !tv2) return res.status(405).json({ success: false, message: "Cannot validate user token" });
    if(!bcrypt.compareSync(password, data[0].password)) return res.status(424).json({ success: false, message: "Invalid password input" });
    const { error: derr } = await esc.delete().eq("email", email);
    if(derr) return sverr500(res, derr);
    if(method == "deny") return res.status(204).json({ success: true, message: "Denied user signup" });
    const tk = genTk();
    const { error: err } = await users.insert({ email: data[0].email, password: data[0].password, token: tk });
    if(err) return sverr500(res, err);
    signTk(res, tk);
    // 201 (Created)
    res.status(201).json({ success: true, message: "Successfully signed up" });
});
type DataFormat = "json" | "csv";
app.all("/admin/export", async (req, res) => {
    if(!validTk(req)) return unauth401(res);
    const { fmt }: { fmt?: DataFormat } = req.body;
    const fm = fmt ?? "json";
    const out = [sched, users, format, event, esc].map(d => (fm == "csv" ? d.select().csv() : d.select()));
    for(const _ of out) {
        const __ = await _;
        if(__.error) return sverr500(res, __.error);
    }
    const _ = [];
    for(const __ of out) {
        const ___ = await __;
        _.push(___.data);
    }
    res.json({ success: true, message: _ });
});

// public routes
app.all("/sched", async (req, res) => {
    return await __getSched(req, res, "schedules");
});
app.all("/defweek", async (req, res) => {
    return await __getSched(req, res, "defaultWeek");
});
app.all("/cal", async (req, res) => {
    return await __getSched(req, res, "calendar");
});
app.all("/weather", (req, res) => {
    res.send({ weather });
});
app.all("/cookies/hascookie", (req, res) => {
    res.send({ result: !!req.cookies.room });
});
app.all("/cookies/getroomcookie", (req, res) => {
    if(!req.cookies.room) return res.status(403).json({ success: false, message: "No cookie exists" });
    res.json({ success: true, message: decode(req.cookies.room) });
});
app.all("/cookies/signroomcookie", (req, res) => {
    const { room }: RRoom = req.body;
    signRoom(res, jwt.sign({ room }, secret, { expiresIn: "8W" }));
});

// format routes
app.all("/format/peek", async (req, res) => {
    const { room }: RRoom = req.body;
    const { data, error } = await format.select().eq("room", room);
    if(error) return sverr500(res, error);
    res.json({ success: true, message: data });
});
export interface StyleColor {
    style: { color: string };
}
export interface StyleImg {
    style: { img: string };
}
export interface StyleBoth {
    style: { color: string, img: string };
}
export type FStyleGuide = { color?: string, img?: string };
app.all("/format/put", async (req, res) => {
    const { room, style }: RRoom & { style: FStyleGuide } = req.body;
    const { data, error } = await format.select().eq("room", room);
    if(error) return sverr500(res, error);
    // respond with 417 (Expectation Failed)
    if(!data.length) return res.status(417).json({ success: false, message: `No formats for '${room}' (did you meant to create this resource?)` });
    const { error: err } = await format.update({ room, ...style }).eq("room", room);
    if(err) return sverr500(res, err);
    // respond with 205 (Reset Content)
    res.status(205).json({ success: true, message: "Put new styles" });
});
app.all("/format/create", async (req, res) => {
    const { room, style }: RRoom & { style: FStyleGuide } = req.body;
    const { data, error } = await format.select().eq("room", room);
    if(error) return sverr500(res, error);
    // respond with 405 (Method Not Allowed)
    if(data.length) return res.status(405).json({ success: false, message: `Style already exists for '${room}' (did you mean to update this resource?)` });
    const { error: err } = await format.insert({ room, ...style });
    if(err) return sverr500(res, err);
    // respond with 201 (Created)
    res.status(201).json({ success: true, message: "Created style for room" });
});
app.all("/format/drop", async (req, res) => {
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
app.all("/event/all", async (req, res) => {
    const { data, error } = await event.select();
    if(error) return sverr500(res, error);
    res.json({ success: true, message: data });
});
app.all("/event/at", async (req, res) => {
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
app.all("/event/named", async (req, res) => {
    const { name }: { name: string } = req.body;
    const { data, error } = await event.select().eq("name", name);
    if(error) return sverr500(res, error);
    if(!data.length) return res.status(404).json({ success: true, message: "No content found for name" });
    res.json({ success: true, message: data });
});
app.all("/event/gen", async (req, res) => {
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
app.all("/event/drop", async (req, res) => {
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
