import * as supabase from "@supabase/supabase-js";
import * as bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";
import InvalidRoomReceivedError from "../errors/InvalidRoomReceivedError";
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
const client = supabase.createClient(process.env.supabase_url as string, process.env.supabase_key as string);
// schedule table relationship
const sched = client.from("sched");
// id-auth table
const idAuth = client.from("id");
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
// removes callback to instead directly return
async function getCurrentSchedule(room: string) {
    const { error, data } = await getRoom(room);
    if(error) throw error;
    return data[0];
}

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});