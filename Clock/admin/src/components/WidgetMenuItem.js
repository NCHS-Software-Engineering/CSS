import React, { useState, useEffect } from "react";

function WidgetMenuItem (params = null) // params.img, params.name, params.callback
{
    function doCallback ()
    {
        params.callback(params.name);
    }

    return (
        <div style={{background:"purple"}} onClick={doCallback}>
            {params.img}
        </div>
    );
}

export default WidgetMenuItem;