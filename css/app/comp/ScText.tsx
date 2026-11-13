import { useEffect, useState } from "react";
import { Justify } from "../types/Justify";
import NoElementError from "../errors/NoElementError";

export default function ScText(props: { id: string, portionFilled?: number, justify?: Justify, text: string, width: number, height: number }) {
    // apply init during construction
    const [pf, spf] = useState(props?.portionFilled ?? 0.9);
    const [js, sjs] = useState<Justify>(props?.justify ?? "center");
    const [id, sid] = useState(props?.id ?? "");
    const [tx, stx] = useState(props?.text ?? "");
    const [txl, stxl] = useState(props?.text.length ?? 12);
    const [fs, sfs] = useState(12);
    const [ww, sww] = useState(1);
    const [wh, swh] = useState(1);
    const [w, sw] = useState(props?.width ?? 1);
    const [h, sh] = useState(props?.height ?? 1);
    // dont do this whenever anything changes
    // only when text length is changed
    useEffect(() => {
        if(txl != 0) throw new Error();
    }, [txl]);
    useEffect(() => {
        wrs();
        const lf = () => wrs();
        window.addEventListener("resize", lf);
        // fix: has to be reference to function
        // in order to remove from event listeners
        // (cannot be anon)
        return () => {
            window.removeEventListener("resize", lf);
        };
    });
    function wrs() {
        sww(window.innerWidth);
        swh(window.innerHeight);
    }
    function rs() {
        let tfs = fs;
        const e = document.getElementById(id + "text");
        if(!e) throw new NoElementError(id + "text");
        const r = (wh * (h / 9)) / e.scrollHeight;
        tfs *= r;
        const w16 = ww * (w / 16);
        if(e.scrollWidth * r > w16) {
            tfs *= w16 / (e.scrollWidth * r);
        }
        tfs *= pf;
        if(Math.abs(tfs - fs) > 1) sfs(tfs);
    }
    return <div id={id + "container"} style={{ display: "flex", alignItems: "center", justifyContent: js, width: "100%", height: "100%" }}>
        <p id={id + "text"} style={{ display: "inline-block", fontSize: fs, overflow: "hidden" }}>{tx}</p>
    </div>
}