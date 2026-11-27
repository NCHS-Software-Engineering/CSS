"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Anim({ frames, rate, show, frm }: { frames: string[], rate: number, show?: boolean, frm?: number }) {
    const [see, setSee] = useState(show ?? false);
    const [cf, setCF] = useState(frm ?? 0);
    useEffect(() => {
        const iv = setInterval(() => setCF(c => c+1 < frames.length ? c+1 : 0), rate);
        return () => clearInterval(iv);
    }, [frames, rate]);
    return <div style={{ visibility: see ? "visible" : "hidden" }}>
        <Image src={frames[cf]} alt=""/>
    </div>
}