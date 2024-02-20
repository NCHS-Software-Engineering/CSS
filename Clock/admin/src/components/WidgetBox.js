import React, { useState, useEffect } from "react";

function WidgetBox (params = null) // params.img, params.type, params.callback
{
    return (
        <div style={{background:"purple"}} onMouseDown={() => {params.callback(params.type)}}>
            {params.img}
        </div>
    );
}

export default WidgetBox;