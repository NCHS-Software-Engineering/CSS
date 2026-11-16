import React, { useState } from "react";
import { Props } from "../types/Props";
import ScText from "../comp/ScText";

export default function Txbox({ id, row, col, width, height, config, text }: Props & { text: string }) {
    const [crow, setRow] = useState((row ?? 0) + 1);
    const [ccol, setCol] = useState((col ?? 0) + 1);
    const [cwidth, setWidth] = useState(width ?? 1);
    const [cheight, setHeight] = useState(height ?? 1);
    function split() {
        const lns: string[] = [];
        var ln = "";
        var len = 1;
        for(let i = 0; i < text.length; i++) {
            ln += text[i] == " " || text[i] == "\n" ? " " : text[i];
            if(text[i] == "\n") {
                if(text.length > len) {
                    len = text.length;
                }
                lns.push(ln);
            }
        }
        const res: React.JSX.Element[] = [];
        for(let i = 0; i < lns.length; i++) {
            let ln = lns[i];
            ln += " ".repeat(len - ln.length);
            res.push(<div>
                <ScText id={id + "line" + i + "/" + lns.length} justify="left" portionFilled={1} text={ln} width={cwidth} height={cheight / lns.length}/>
            </div>);
        }
        return res;
    }
    // again, change when util ready
    return null;
}