import { useEffect, useState } from "react";
import Valid from "./auth/Valid";
import { adminRoute, AdminRoute } from "../sv";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Admin() {
    return <Valid>
        <div>
            <h3>Hi, admin.</h3>
            <p>Check out these actions:</p>
            <button><Link href="./action/room">Room Actions</Link></button>
            <button><Link href="./action/sched">Schedule Actions</Link></button>
            <button><Link href="./action/event">Event Actions</Link></button>
            <button><Link href="./action/format">Format Actions</Link></button>
        </div>
    </Valid>
}