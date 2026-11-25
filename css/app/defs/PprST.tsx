"use client";
import ScText from "../comp/ScText";
import { PropElem } from "../types/PropElem";
import { Props } from "../types/Props";
import Ppr from "./Ppr";

export default function PprST({ props, tx }: { props: Required<Props>, tx: string }): PropElem {
    return <Ppr props={props}>
        <div style={{ width: "100%", height: "100%" }}>
            <ScText id={props.id} text={tx} width={props.width} height={props.height}/>
        </div>
    </Ppr>
}