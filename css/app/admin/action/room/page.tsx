/* eslint-disable react-hooks/immutability */
import { useRef, useState } from "react";
import Action from "../Action";
import { adminRoute, AdminRoute } from "@/app/sv";
import { Sched } from "@/app/types/Sched";
import { PName } from "@/app/types/PName";

export default function RoomAction() {
    const [read, setRead] = useState<AdminRoute["rooms"]["message"]>();
    const [rmMeta, setMeta] = useState<{ room: string, sched?: Sched[] }>();
    const [schedList, setSchedList] = useState<Sched[]>();
    const [partMeta, setPartMeta] = useState<Partial<Sched>>();
    const __apply = <T extends keyof Sched>(key: T, value: Sched[T]) => {
        const meta = partMeta ?? {};
        meta[key] = value;
        setPartMeta(meta);
    }
    return <Action<typeof read | void> read={async () => {
        const out = await adminRoute.json("rooms");
        setRead(out.message);
        return out.message;
    }} write={async () => {
        if(!rmMeta) return;
        await adminRoute.json("put", {
            room: rmMeta.room,
            schedule: rmMeta.sched
        });
        setMeta(undefined);
        return;
    }}>
        <div>{read && JSON.stringify(read, null, 4)}</div>
        <form style={{ padding: "10px", borderRadius: "10px" }} onSubmit={(e) => {
            e.preventDefault();
            setMeta({ room: e.currentTarget.room.value, sched: schedList });
        }}>
            <input type="text" placeholder="Enter room name here..." id="room" name="room"/>
            <div>
                {schedList && schedList.map((x, i) => {
                    return <div key={i}>
                        <p>Period: {x.name}</p>
                        <p>Start: {x.start}</p>
                        <p>End: {x.end}</p>
                    </div>
                })}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if(!partMeta?.name || !partMeta?.start || !partMeta?.end) return;
                    setSchedList((schedList ?? []).concat(partMeta as Sched));
                    setPartMeta({});
                }}>
                    <label htmlFor="pn">Period Name</label>
                    <input type="text" placeholder="Period name..." required={!!partMeta} onInput={(e) => __apply("name", e.currentTarget.value as PName)} name="pn"/>
                    <label htmlFor="start">Start Time</label>
                    <input type="time" required={!!partMeta} onChange={(e) => __apply("start", e.currentTarget.value)} name="start"/>
                    <label htmlFor="end">End Time</label>
                    <input type="time" required={!!partMeta} onChange={(e) => __apply("end", e.currentTarget.value)} name="end"/>
                    <button type="submit">Done</button>
                </form>
            </div>
            <button type="submit">Save Meta</button>
        </form>
    </Action>
}