import React, { useState, useEffect} from "react";
import ScaleText from "../components/ScaleText";
import { Paper } from "@mui/material";


function Textbox(props = null)
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

  function splitText(text)
  {
    const lines = [];
    var tempLine = " ";
    var longestLength = 1;

    for (let i = 0; i < text.length; i++)
    {
      if (text.charAt(i) === " " || text.charAt(i) === "\n") tempLine += " ";
      else tempLine += text.charAt(i);

      if (text.charAt(i) === "\n") // check for newline character
      {
        if (tempLine.length > longestLength) longestLength = tempLine.length;
        lines.push(tempLine);
        tempLine = " ";
      }
    }
    tempLine += " ";
    if (tempLine.length > longestLength) longestLength = tempLine.length;
    lines.push(tempLine);

    const resList = [];
    for (let i = 0; i < lines.length; i++)
    {
      var line = lines[i];
      line += " ".repeat(longestLength - line.length);

      resList.push(
        <div>
          <ScaleText id={props.id+"line"+i+"/"+lines.length} justify={"left"} portionFilled={1} text={line} width={width} height={height / lines.length}/>
        </div>
      );
    }

    // console.log("num lines", lines.length);

    return resList;
  }


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
            "borderRadius": 20,
            overflow: "hidden"
        }}
    >
      <div style={{width: "100%", height: "100%"}}>
        {(config.text) ? splitText(config.text) : <></>}
      </div>
    </Paper>
  );
}

export default Textbox;