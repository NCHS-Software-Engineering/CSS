import React, { useState, useEffect } from "react";
import { MuiColorInput } from 'mui-color-input'
import { Box, Checkbox } from "@mui/material";


function DateConfig(params=null) // params.id, params.config, params.callback
{
    const [ID, setID] = useState(-1);

    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    const [textColor, setTextColor] = useState((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
    
    function runCallback() {params.callback({"backgroundColor":backgroundColor, "textColor":textColor});}

    useEffect(() =>
    {
        if (params.id != ID)
        {
            setID(params.id);
            if (!params.config || backgroundColor === params.config.backgroundColor && textColor === params.config.textColor) runCallback();

            setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
            setTextColor((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
        }
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor, textColor]);


    return (
        <Box>
            <Box sx={{marginBottom: 1}}> {/* Background color selection */}
                <p>Background Color: </p>
                <MuiColorInput  
                    format="hex"
                    value={backgroundColor}
                    onChange={(newColor) => {setBackgroundColor(newColor);}} 
                />
            </Box>
            <Box sx={{marginBottom: 1}}> {/* Text color selection */}
                <p>Text Color: </p>
                <MuiColorInput 
                    format="hex"
                    value={textColor}
                    onChange={(newColor) => {setTextColor(newColor);}} 
                />
            </Box>
        </Box>
    );
}

export default DateConfig;