import React, { useState, useEffect} from "react";
import ScaleText from "../components/ScaleText";
import { Paper } from "@mui/material";

// TODO: have a specific text display when 'props.periodName' === null (NOTE: currently nothing will display)
function PeriodName(props = null) // props.id, props.periodName
{
  const [display, setDisplay] = useState("");

  const [col, setCol] = useState(1);
  const [row, setRow] = useState(1);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);

  useEffect(() => {
      setDisplay(props.periodName ? props.periodName : "");

      setCol(props.col + 1);
      setRow(props.row + 1);
      setWidth(props.width);
      setHeight(props.height);
  }, [props]);


  return (
    <Paper elevation={20}
        style=
        {{
            backgroundColor: props.config.backgroundColor,
            color: props.config.textColor,
            "gridColumnStart": col,
            "gridColumnEnd": col+width,
            "gridRowStart": row,
            "gridRowEnd": row+height,
            "borderRadius": 20
        }}
    >
      <div style={{width: "100%", height: "100%", fontWeight: '800'}}>
        <ScaleText id={props.id} text={display} width={width} height={height}/>
      </div>
    </Paper>
  );
}

export default PeriodName;