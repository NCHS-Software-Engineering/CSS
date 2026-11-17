import { AdvancedNetMap } from "@beanthealien/net";
import { WeatherData } from "./server/server";

interface Route {
    weather: WeatherData;
    roomCookie: string;
}
export const map = new AdvancedNetMap<Route>("http://localhost:3001");