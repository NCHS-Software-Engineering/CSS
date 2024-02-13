import '../App.css';
import React, { useState, useEffect, useRef} from "react";

function RTC()
{
    const [time, setTime] = useState();

    useEffect(() => {
        const interval =  setInterval(() => {
                const tempDate = new Date();
                setTime(tempDate.getHours().toString().padStart(2, "0") + ":" + tempDate.getMinutes().toString().padStart(2, "0") + ":" + tempDate.getSeconds().toString().padStart(2, "0"));
            }, 100);
    }, []);

    return(
        <div>
            <p>{time}</p>
        </div>
    )    
}

export default RTC;