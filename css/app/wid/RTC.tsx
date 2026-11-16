import { useEffect, useState } from "react";
import { Props } from "../types/Props";

export default function RTC({ id, row, col, width, height, config }: Props) {
    const [crow, setRow] = useState((row ?? 0) + 1);
    const [ccol, setCol] = useState((col ?? 0) + 1);
    const [cwidth, setWidth] = useState(width ?? 1);
    const [cheight, setHeight] = useState(height ?? 1);
    const [disp, setDisp] = useState("");
    useEffect(() => {
        const iv = setInterval(() => {
            const date = new Date();
            setDisp(date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true }));
        }, 100);
        return () => clearInterval(iv);
    }, []);
    // FINISH WHEN UTIL
    // TYPE PText EXISTS
    return null;
}