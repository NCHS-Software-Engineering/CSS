import { useEffect, useState } from "react";
import { PName } from "../types/PName";
import { Sched } from "../types/Sched";

export default function Time(props: { schedule: Sched[], countdownCallback: (inTime: number) => void, periodNameCallback: (inPeriodName: PName) => void }) {
    const [schedule, setSched] = useState<Sched[]>(props.schedule);
    const [day, setDay] = useState(0);
    const [period, setPrd] = useState(0);
    const [prdName, setPrdNm] = useState<PName>("UNKNOWN");
    const [passPrd, setPP] = useState(false);
    const [schoolOut, setOut] = useState(true);
    const [countdown, setCount] = useState(-1);
    useEffect(() => scheduleInit(), [schedule]);
    function scheduleInit() {
        const td = new Date();
        setDay(td.getDay());
        // if schedule is empty
        // then school is out
        if(schedule.length == 0) return setOut(true);
        schedule.forEach((sc, i) => {
            // normalized time strings
            const st = sc.start.replace(":", "");
            const et = sc.end.replace(":", "");
            const h = td.getHours();
            // FIX: prefer NumberConstructor over parseInt
            if((h * 100) + td.getMinutes() < Number(et)) {
                setPrd(i);
                if(h < Number(st)) {
                    setPP(true);
                    // ternary to shorten script
                    setPrdNm(i == 0 ? "Before School" : "Passing Period");
                }
            } else {
                setPP(false);
                setPrdNm(sc.name);
            }
            return setOut(false);
        });
        setOut(true);
    }
    useEffect(() => {
        const iv = setInterval(() => {
            const td = new Date();
            if(td.getDay() != day) scheduleInit();
            if(schoolOut) {
                setCount(-1);
                setPrdNm("UNKNOWN");
            } else {
                let ct = 0;
                let ft = 0;
                ct += td.getHours() * 60 * 60 * 1000;
                ct += td.getMinutes() * 60 * 1000;
                ct += td.getSeconds() * 1000;
                // ternary to shorten script
                const tmp = schedule[period][(passPrd ? "start" : "end")].split(":");
                // FIX: prefer NumberConstructor over parseInt
                ft += Number(tmp[0]) * 60 * 60 * 1000;
                ft += Number(tmp[1]) * 60 * 1000;
                const dt = ft - ct;
                if(dt <= 0) {
                    if(schedule.length <= period + 1 && !passPrd) {
                        setOut(true);
                    } else {
                        if(!passPrd) {
                            setPrd(period + 1);
                            setPrdNm("Passing Period");
                        } else {
                            setPrdNm(schedule[period].name);
                        }
                        setPP(!passPrd);
                    }
                    setCount(-1);
                } else {
                    setCount(dt);
                }
            }
        }, 100);
        return () => clearInterval(iv);
    }, []);
    // ^^^ fix to not do it whenever something changes
    // fine to fire once on init
    // (specifically since modifying things inside)
    // (the interval causes a re-render)
    useEffect(() => props.countdownCallback(countdown), [countdown]);
    useEffect(() => props.periodNameCallback(prdName), [prdName]);
    // no-rendering
    // perfectly valid react
    return null;
}