import { useEffect, useState } from "react";
import Valid from "../auth/Valid";
import { adminRoute, AdminRoute } from "../../sv";
import { useSearchParams } from "next/navigation";

export default function Export() {
    const [data, setData] = useState<AdminRoute["export"][1]["message"]>();
    const param = useSearchParams();
    const [dt, setDT] = useState<"json" | "csv">("json");
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDT((param.get("export") as "json" | "csv") ?? "json");
    }, [param]);
    useEffect(() => {
        (async () => setData((await adminRoute.json("export", { fmt: dt })).message))();
    }, [dt]);
    return <Valid>
        <div>
            {data?.map((x, i) => {
                return <div key={i} style={{ padding: "15px", borderRadius: "10px" }}>
                    <h3>Table: {["Schedule", "Users", "Event", "Format", "Requests"][i]}</h3>
                    {JSON.stringify(x, null, 4)}
                </div>
            })}
        </div>
    </Valid>
}