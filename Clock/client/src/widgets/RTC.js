import React, { useState, useEffect} from "react";

function RTC(props = null) // props.col, props.row, props.width, props.height, props.config
{
    const [col, setCol] = useState(1);
    const [row, setRow] = useState(1);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
  
    useEffect(() => {
        if (!props) return;

        if (props.col) setCol(props.col + 1);
        if (props.row) setRow(props.row + 1);
        if (props.width) setWidth(props.width);
        if (props.height) setHeight(props.height);
    }, [props]);


    const [display, setDisplay] = useState("");

    useEffect(() => {
        const interval =  setInterval(() => 
        {
            const tempDate = new Date();

            var tempdisplay = tempDate.getHours().toString().padStart(2, "0") + ":" + tempDate.getMinutes().toString().padStart(2, "0");
            if (props.config.displaySeconds) tempdisplay += ":" + tempDate.getSeconds().toString().padStart(2, "0")

            setDisplay(tempdisplay)
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return(
        <div className="Widget"
            style=
            {{
                backgroundColor: props.config.backgroundColor,
                color: props.config.textColor,
                "gridColumnStart": col,
                "gridColumnEnd": col+width,
                "gridRowStart": row,
                "gridRowEnd": row+height
            }}
        >
            <p>{display}</p>
        </div>
    )    
}

export default RTC;