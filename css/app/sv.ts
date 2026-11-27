"use client";
import { AdvancedNetMap } from "@beanthealien/net";
import { StyleBoth, StyleColor, StyleImg, WeatherData, FStyleGuide, OnlyRouteTo } from "./server/server";
import { Database } from "./types/Database";
import { Sched } from "./types/Sched";
type DB<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

interface Res<T = string> {
    success: boolean;
    message: T;
}
export interface Route {
    weather: { weather: WeatherData };
    roomCookie: string;
    sched: [{ room: string }, Res<Sched[]>];
    defweek: [{ room: string }, Res<never[]>];
    cal: [{ room: string }, Res<never[]>];
}
interface UInfo {
    email: string;
    password: string;
}
export interface UserRoute {
    signup: [UInfo & { only?: OnlyRouteTo }, Res];
    signin: [UInfo, Res];
    amok: { ok: boolean };
}
export interface AdminRoute {
    updateall: Res;
    rooms: Res<string[]>;
    sched: [{ schedules: Sched[] }, Res];
    defweek: [{ defaultWeek: never[] }, Res];
    cal: [{ calendar: never[] }, Res];
    put: [{ room: string, schedule?: Sched[] }, Res];
    drop: [{ room: string }, Res];
    ren: [{ room: string, name: string }, Res];
    export: [{ fmt: "json" | "csv" }, Res<[DB<"sched">, DB<"users">, DB<"event">, DB<"format">, DB<"req">]>];
}
export interface FormatRoute {
    peek: [{ room: string }, Res<DB<"format">>];
    put: [{ room: string, style: FStyleGuide }, Res];
    create: [{ room: string, style: FStyleGuide }, Res];
    drop: [{ room: string }, Res];
}
export interface EventRoute {
    all: Res | Res<DB<"event">[]>;
    at: [{ index: number }, Res | Res<DB<"event">[]>];
    named: [{ name: string }, Res | Res<DB<"event">[]>];
    gen: [{ name: string, time: string }, Res];
    drop: [{ name: string }, Res];
}
export interface CookieRoute {
    getroomcookie: Res<string> | Res<{ room: string }>;
    signroomcookie: [{ room: string }, never];
    hascookie: { result: boolean };
}
export const map = new AdvancedNetMap<Route>("http://localhost:3001/");
export const cookieMap = map.fork<CookieRoute>("cookies/");
export const usrRoute = map.fork<UserRoute>("user/");
export const adminRoute = map.fork<AdminRoute>("admin/");
export const fmtRoute = map.fork<FormatRoute>("format/");
export const eventRoute = map.fork<EventRoute>("event/");