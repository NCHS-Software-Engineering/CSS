import { usrRoute } from "@/app/sv";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Auth validation on user state.
 * 
 * If `other` is specified, then the component automatically redirects the user to
 * the URL specified by `other`.
 */
export default function Valid({ children, other }: { children: React.ReactElement, other?: string }) {
    const [ok, setOk] = useState<boolean>();
    useEffect(() => {
        (async () => setOk((await usrRoute.json("amok")).ok));
    }, []);
    if(typeof ok == "undefined") return <div>
        Waiting for auth response
    </div>
    if(!ok && other) return redirect(other);
    return <div>
        {!ok ? <div>
            <h3>Not Signed In</h3>
            <p>You can&apos;t access this page. Log in first.</p>
            <button><Link href="../user/signin">Sign In</Link></button>
        </div> : children}
    </div>
}