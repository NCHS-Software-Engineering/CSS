import React, { useState, useEffect } from "react";
import { MuiColorInput } from 'mui-color-input'
import { Box } from "@mui/material";


function SiteConfig(params=null) // params.config, params.callback
{
    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    
    function runCallback() {params.callback({"backgroundColor":backgroundColor});}

    useEffect(() =>
    {
        if (!params.config) runCallback();

        setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor]);


    return (
        <Box>
            <Box> {/* Background color selection */}
                <p>Background Color: </p>
                <MuiColorInput  
                    format="hex"
                    value={backgroundColor}
                    onChange={(newColor) => {setBackgroundColor(newColor);}} 
                />
            </Box>
        </Box>
    );
}

export default SiteConfig;