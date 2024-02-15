import React, { useState, useEffect } from "react";

function WidgetDraggableItem (params = null) // params.img, params.name, params.callback
{
    const [topDist, setTopDist] = useState(0);
    const [leftDist, setLeftDist] = useState(0);
    const [clicked, setClicked] = useState(false);
    
    document.body.onmousemove = function(e) {
        if(!clicked) return;

        setTopDist(e.clientY);
        setLeftDist(e.clientX);

        console.log(e.clientX);
    }

    document.body.onmouseup = function(e) {
        setClicked(false);
        console.log("haaa");
    }

    return (
        <div style={{background:"orange", position:"absolute", top:{topDist}, left:{leftDist}, width:200, height:200}} onMouseDown={() => {setClicked(true); console.log("ahhh");}}>
            {params.img}
        </div>
    );
} 

export default WidgetDraggableItem;