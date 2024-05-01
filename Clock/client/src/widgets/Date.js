import React, { useState, useEffect} from "react";
import ScaleText from "../components/ScaleText";
import { Paper } from "@mui/material";

function DateWidget(props = null) // props.id, props.col, props.row, props.width, props.height, props.config
{
    const [col, setCol] = useState(1);
    const [row, setRow] = useState(1);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
    const [config, setConfig] = useState({});
  
    useEffect(() => {
        setCol(props.col + 1);
        setRow(props.row + 1);
        setWidth(props.width);
        setHeight(props.height);
        setConfig(props.config);
    }, [props]);


    const [display, setDisplay] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const tempDate = new Date();
    
            // Get today's date in the format "month name day, year"
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const today = tempDate.toLocaleDateString(undefined, options);
    
            // Add the date to the display
            var tempdisplay = today;
    
            setDisplay(tempdisplay)
        }, 60000);
    
        return () => clearInterval(interval);
    }, [config]);

    
    return(
        <Paper elevation={20}
            style=
            {{
                backgroundColor: config.backgroundColor,
                color: config.textColor,
                "gridColumnStart": col,
                "gridColumnEnd": col+width,
                "gridRowStart": row,
                "gridRowEnd": row+height,
                "borderRadius": 20,
                overflow: "hidden"
            }}
        >
            <div style={{width: "100%", height: "100%"}}>
                <ScaleText id={props.id} text={display} width={width} height={height}/>
            </div>
        </Paper>
    )    
}

export default DateWidget;