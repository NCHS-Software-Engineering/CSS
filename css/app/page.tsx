import Image from "next/image";

export default function Home() {
    const [room, setRoom] = useState();
    let ovr = false;
    const [sched, setSched] = useState<Sched[]>([]);
    const [cd, setCD] = useState<Count>();
    const [prdNm, setPrdNm] = useState<PName>();
    const [wid, setWid] = useState<React.JSX.Element[]>();
    const [weather, setWeather] = useState<WeatherData>();
    const [disp, setDip] = useState<React.JSX.Element[]>();
    useEffect(() => {
        const port = 8000;
        const svURL = "ws://" + window.location.hostname + ":" + port;
        const ws = new WebSocket(svURL);
        ws.addEventListener("open", () => {
            ws.send(room);
        });
        ws.addEventListener("message", (e) => {
            const d = JSON.parse(e.data);
            setSched(d.schedule);
            setWid(d.widget);
            setWeather(d.weather);
            return () => ws.close();
        });
        return () => ws.close();
    }, [room]);
    useEffect(() => {
        const tds = [];
        for(const w of wid) {
            const typ = w.type;
        }
    });
}
