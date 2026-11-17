import { useState } from "react";
import { Props } from "../types/Props";
import PprST from "../defs/PprST";
import { PName } from "../types/PName";

export default function PdNm({ id, row, col, width, height, config, periodName }: Props & { periodName?: PName }) {
    const [disp, setDisp] = useState(() => periodName ?? "No School");
    const [crow, setRow] = useState((row ?? 0) + 1);
    const [ccol, setCol] = useState((col ?? 0) + 1);
    const [cwidth, setWidth] = useState(width ?? 1);
    const [cheight, setHeight] = useState(height ?? 1);
    // fix return when util ready
    return <PprST props={{ width: cwidth, height: cheight, config, row: crow, col: ccol, id }} tx={periodName ?? "UNKNOWN"}/>;
}