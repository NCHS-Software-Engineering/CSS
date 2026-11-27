"use client";
import Image from "next/image";
import { useState } from "react";

export default function Cat({ apd, show }: { apd?: boolean, show?: boolean }) {
    return apd ? <div style={{ visibility: show ? "visible" : "hidden" }}>
        <Image src="loadcat.svg" alt="cat"/>
    </div> : (show ? <div><Image src="../loadcat.svg" alt="cat" width={50} height={50}/></div> : null);
}