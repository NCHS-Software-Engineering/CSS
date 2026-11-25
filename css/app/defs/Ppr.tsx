"use client";
import { Paper } from "@mui/material";
import React from "react";
import { Props } from "../types/Props";
import { PropElem } from "../types/PropElem";

export default function Ppr({ props, children }: { props: Required<Props>, children: React.JSX.Element }): PropElem {
    return <Paper elevation={20} style={{
        backgroundColor: props.config.bg,
        color: props.config.txClr,
        gridRowStart: props.row,
        gridRowEnd: props.row + props.height,
        gridColumnStart: props.col,
        gridColumnEnd: props.col + props.width,
        borderRadius: 20,
        overflow: "hidden"
    }}>
        {children}
    </Paper>
}