import React, { useState, useEffect} from "react";
import ScaleText from "../components/ScaleText";
import { Paper } from "@mui/material";

function Countdown(props = null) // props.id, props.deltaTime
{
  const [display, setDisplay] = useState("");

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
      setConfig(props.config)
  }, [props]);


  useEffect (() => {
    if (!props)return
    
    if (!props.deltaTime); // TODO: determine what do do if the countdown is over (i.e. what to do when school day ends)
    else
    {
      const hours = Math.floor(props.deltaTime / (60 * 60 * 1000));
      const minutes = Math.floor(props.deltaTime / (60 * 1000));
      const seconds = Math.floor(props.deltaTime / (1000));

      var tempDisplay = "";
      if (hours > 0) tempDisplay += hours.toString().padStart(2, "0") + ":"; // display hours if 1 hour or more is left
      if (minutes > 0) tempDisplay += (minutes % 60).toString().padStart(2, "0"); // display minutes if 1 minute or more is left
      if (config.displaySeconds) 
      {
        if (minutes > 0) tempDisplay += ":";
        tempDisplay += (seconds % 60).toString().padStart(2, "0"); // add the seconds display
      }
      setDisplay(tempDisplay);
    }
  }, [props])
  
  
  return (
    <Paper elevation={20}
      style=
      {{
          backgroundColor: config.backgroundColor,
          color: config.textColor,
          "gridColumnStart": col,
          "gridColumnEnd": col+width,
          "gridRowStart": row,
          "gridRowEnd": row+height,
          "borderRadius": 20
      }}
    >
      <div style={{width: "100%", height: "100%"}}>
        <ScaleText id={props.id} text={display} width={width} height={height}/>
      </div>
    </Paper>
  );
}

export default Countdown;