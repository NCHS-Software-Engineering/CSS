import React, { useState, useEffect} from "react";
import ScaleText from "../components/ScaleText";
import { Paper } from "@mui/material";

function Countdown(props = null) // props.id, props.deltaTime
{
  const [backColor, setBackColor] = useState("#000000");

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
      
      if (minutes <= config.warningTime && (minutes*60) >= (config.warningTime * 60)-config.blinkDuration)
      {
        setBackColor(backColor === config.backgroundColor ? config.blinkColor : config.backgroundColor);
      }
      else if (backColor !== config.backgroundColor)
      {
        setBackColor(config.backgroundColor);
      }

      console.log(config.warningTime, config.blinkDuration)
    }
  }, [props])
  

  return (
    <Paper elevation={20}
      style=
      {{
          backgroundColor: backColor,
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
  );
}

export default Countdown;