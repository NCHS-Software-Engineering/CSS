import { Card } from "@mui/material";
import React, { useState } from "react";

function WidgetBox (props = null) // props.image, props.subtitle, props.type, props.callback
{
    const [cursor, setCursor] = useState("grab");

    return (
        <Card sx={{display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none", padding: 1, marginRight: 1, cursor: cursor}} 
            onMouseDown={() => {setCursor("grabbing"); props.callback(props.type);}}
            onMouseUp={() => {setCursor("grab");}}
            onMouseLeave={() => {setCursor("grab");}}
        >
            {props.image}
            <p>{props.subtitle}</p>
        </Card>
    );
}

export default WidgetBox;