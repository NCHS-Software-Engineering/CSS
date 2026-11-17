import { useEffect, useState } from "react";
import { Props } from "../types/Props";

export default function Dates({ id, row, col, width, height, config }: Props) {
    const [crow, setRow] = useState((row ?? 0) + 1);
    const [ccol, setCol] = useState((col ?? 0) + 1);
    const [cwidth, setWidth] = useState(width ?? 1);
    const [cheight, setHeight] = useState(height ?? 1);
    const [disp, setDisp] = useState("");
    function updDate() {
        const date = new Date();
        return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    }
    setDisp(updDate());
    useEffect(() => {
        const itv = setInterval(() => setDisp(updDate()), 60000);
        return () => clearInterval(itv);
    }, []);
    return <PprST props={{ row: crow, col: ccol, width: cwidth, height: cheight, config, id }} tx={disp}/>
}