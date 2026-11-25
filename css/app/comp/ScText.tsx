"use client";
import { useEffect, useRef, useState } from "react";
import { Justify } from "../types/Justify";
import NoElementError from "../errors/NoElementError";
import NoTextLengthError from "../errors/NoTextLengthError";
import { PropElem } from "../types/PropElem";

export default function ScText(props: { id: string, portionFilled?: number, justify?: Justify, text: string, width: number, height: number }): PropElem {
    // apply init during construction
    const [portionFilled, setPortionFilled] = useState(props?.portionFilled ?? 0.9);
    const [justify, setJustify] = useState<Justify>(props?.justify ?? "center");
    const [id, setID] = useState(props?.id ?? "");
    const [tx, setTx] = useState(props?.text ?? "");
    const [txLen, setTextLn] = useState(props?.text.length ?? 12);
    const [fontSize, setFS] = useState(12);
    const [windWidth, setWindWidth] = useState(() => typeof window != "undefined" ? window.innerWidth : 1);
    const [windHeight, setWindHeight] = useState(() => typeof window != "undefined" ? window.innerHeight : 1);
    const [width, setWidth] = useState(props?.width ?? 1);
    const [height, setHeight] = useState(props?.height ?? 1);
    const textElem = useRef<HTMLParagraphElement>(null);
    // dont do this whenever anything changes
    // only when text length is changed
    useEffect(() => {
        // FIX: change txLen != 0 => !txLen
        // i was on something when i wrote txLen != 0
        if(!tx.length && tx != "" && !txLen) throw new NoTextLengthError(tx);
    }, [txLen]);
    function wrs() {
        setWindWidth(window.innerWidth);
        setWindHeight(window.innerHeight);
    }
    useEffect(() => {
        const lf = () => wrs();
        window.addEventListener("resize", lf);
        // fix: has to be reference to function
        // in order to remove from event listeners
        // (cannot be anon)
        return () => {
            window.removeEventListener("resize", lf);
        };
    }, []);
    function rs() {
        let tfs = fontSize;
        // fix: DONT USE DOCUMENT.GETELEMENTBYID
        // https://stackoverflow.com/questions/36996931/are-reactjs-and-jquery-mutual-exclusive
        const e = textElem.current; // document.getElementById(id + "text");
        if(!e) throw new NoElementError(id + "text");
        const r = (windHeight * (height / 9)) / e.scrollHeight;
        tfs *= r;
        const w16 = windWidth * (width / 16);
        if(e.scrollWidth * r > w16) {
            tfs *= w16 / (e.scrollWidth * r);
        }
        tfs *= portionFilled;
        if(Math.abs(tfs - fontSize) > 1) setFS(tfs);
    }
    return <div id={id + "container"} style={{ display: "flex", alignItems: "center", justifyContent: justify, width: "100%", height: "100%" }}>
        <p id={id + "text"} style={{ display: "inline-block", fontSize: fontSize, overflow: "hidden" }} ref={textElem}>{tx}</p>
    </div>
}