import React, { useState, useEffect} from "react";

function Countdown(props = null) // props.deltaTime
{
  const [display, setDisplay] = useState("");

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
      if (props.config.displaySeconds || (props.config.displaySecondsLastMinute && minutes <= 0)) tempDisplay += ":" + (seconds % 60).toString().padStart(2, "0"); // add the seconds display

      setDisplay(tempDisplay);
    }
  }, [props])
  

  return (
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
  );

}

export default Countdown;