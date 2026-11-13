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
const conMap: Record<string, WebSocket[]> = {};
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
wss.on("connection", (ws) => {});
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});