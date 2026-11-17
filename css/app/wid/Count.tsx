/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { PName } from "../types/PName";
import { Paper } from "@mui/material";
import ScText from "../comp/ScText";
import PprST from "../defs/PprST";
import { Props } from "../types/Props";
import { Config } from "../types/Config";
import { Size } from "../types/Size";
import { PropElem } from "../types/PropElem";

// because theres a config
// for some reason
// dont know why
interface CountConfig extends Config {
    //warn: number;
    dsSecs: boolean;
}
export default function Count({ id, delta, row, col, width, height, config, prdNm }: Props & {
    delta?: number, config: CountConfig, prdNm?: PName
 }): PropElem {
    const bg = config.bg;
    const [tx, setTx] = useState(":)");
    const [crow, setRow] = useState((row ?? 0) + 1);
    const [ccol, setCol] = useState((col ?? 0) + 1);
    const [cwidth, setWidth] = useState(width ?? 1);
    const [cheight, setHeight] = useState(height ?? 1);
    useEffect(() => {
        if(!delta) {
            setTx("No School");
        } else {
            const hr = Math.floor(delta / (60 * 60 * 1000));
            const min = Math.floor(delta / (60 * 1000));
            const sec = Math.floor(delta / 1000);
            let td = "";
            const pad = (value: number) => value.toString().padStart(2, "0");
            if(hr > 0) td += pad(hr) + ":";
            if(min > 0) td += pad(min % 60);
            if(config.dsSecs) {
                if(min > 0) td += ":";
                td += pad(sec % 60);
            }
            setTx(td);
        }
    }, []);
    return <PprST props={{ width: cwidth, height: cheight, config, row: crow, col: ccol, id }} tx={tx}/>
}