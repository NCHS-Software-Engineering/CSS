import { useState } from "react";
import { Props } from "../types/Props";

export default function PdNm({ row, col, width, height, config, periodName }: Props & { periodName?: string }) {
    const [disp, setDisp] = useState(() => periodName ?? "No School");
    const [crow, setRow] = useState((row ?? 0) + 1);
    const [ccol, setCol] = useState((col ?? 0) + 1);
    const [cwidth, setWidth] = useState(width ?? 1);
    const [cheight, setHeight] = useState(height ?? 1);
    // fix return when util ready
    return null;
}