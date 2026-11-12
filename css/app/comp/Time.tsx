import { useEffect, useState } from "react";
import { PName } from "../types/PName";

export default function Time(props: { schedule: never, countdownCallback: (inTime: number) => void, periodNameCallback: (inPeriodName: PName) => void }) {
    const [sch, ssch] = useState<never[]>([]);
    const [d, sd] = useState(0);
    const [p, sp] = useState(0);
    const [pn, spn] = useState<PName>("UNKNOWN");
    const [pp, spp] = useState(false);
    const [so, sso] = useState(true);
    const [cd, scd] = useState(Infinity);
    useEffect(() => {
        //
    }, []);
}