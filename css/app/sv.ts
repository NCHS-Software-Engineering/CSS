"use client";
import { AdvancedNetMap } from "@beanthealien/net";
import { StyleBoth, StyleColor, StyleImg, WeatherData } from "./server/server";
import { Database } from "./types/Database";
import { Sched } from "./types/Sched";
type DB<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

interface Res<T = string> {
    success: boolean;
    message: T;
}
interface Route {
    weather: { weather: WeatherData };
    roomCookie: string;
    sched: [{ room: string }, Res | Res<Sched[]>];
    defweek: [{ room: string }, Res<never[]>];
    cal: [{ room: string }, Res<never[]>];
}
interface UInfo {
    name: string;
    password: string;
}
interface UserRoute {
    signup: [UInfo, Res];
    signin: [UInfo, Res];
}
interface AdminRoute {
    updateall: Res;
    rooms: Res;
    sched: [{ schedules: Sched[] }, Res];
    defweek: [{ defaultWeek: never[] }, Res];
    cal: [{ calendar: never[] }, Res];
    put: [{ room: string, schedule?: Sched[] }, Res];
    drop: [{ room: string }, Res];
    ren: [{ room: string, name: string }, Res];
}
type StyleType = StyleColor | StyleImg | StyleBoth;
interface FormatRoute {
    peek: [{ room: string }, Res | Res<DB<"format">>];
    put: [{ room: string, style: StyleType }, Res];
    create: [{ room: string, style: StyleType }, Res];
    drop: [{ room: string }, Res];
}
interface EventRoute {
    all: Res | Res<DB<"event">[]>;
    at: [{ index: number }, Res | Res<DB<"event">[]>];
    named: [{ name: string }, Res | Res<DB<"event">[]>];
    gen: [{ name: string, time: string }, Res];
    drop: [{ name: string }, Res];
}
interface CookieRoute {
    getroomcookie: { cookie: { room: string } };
    signroomcookie: [{ room: string }, never];
}
export const map = new AdvancedNetMap<Route>("http://localhost:3001");
export const cookieMap = map.fork<CookieRoute>("/cookies/");
export const usrRoute = map.fork<UserRoute>("/users/");
export const adminRoute = map.fork<AdminRoute>("/admin/");
export const fmtRoute = map.fork<FormatRoute>("/format/");
export const eventRoute = map.fork<EventRoute>("/event/");