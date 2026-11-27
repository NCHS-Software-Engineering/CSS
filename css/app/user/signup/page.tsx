"use client";
import Cat from "@/app/anim/Cat";
import { usrRoute } from "@/app/sv";
import { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
    const [hidden, setHidden] = useState(true);
    const [wait, setWait] = useState(false);
    const __tog = () => setHidden(!hidden);
    return <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", justifyContent: "center", marginTop: "50px" }}>
        <h1>Sign Up</h1>
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }} onSubmit={async (e) => {
            if(wait) return;
            e.preventDefault();
            const fd = new FormData(e.target);
            setWait(true);
            // for testing purpouses, only route to me
            await usrRoute.json("signup", {
                email: fd.get("email") as string,
                password: fd.get("pass") as string,
                only: "drop"
            });
            setWait(false);
        }}>
            <input type="email" placeholder="Email input..." required name="email" style={{ width: "300px", border: "2px solid #013272", borderRadius: "5px" }}/>
            <div style={{ display: "flex", flexDirection: "row", gap: "15px", alignItems: "center" }}>
                <input type={hidden ? "password" : "text"} placeholder="Secret password input..." required name="pass" style={{ width: "300px", border: "2px solid #013272", borderRadius: "5px" }}/>
                {hidden ? <FaEyeSlash onClick={() => __tog()}/> : <FaEye onClick={() => __tog()}/>}
            </div>
            <button type="submit">Request Sign Up</button>
        </form>
        <Cat apd={false} show={wait}/>
    </div>
}