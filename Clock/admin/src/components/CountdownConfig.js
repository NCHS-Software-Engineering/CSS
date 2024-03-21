import React, { useState, useEffect } from "react";
import { MuiColorInput } from 'mui-color-input'
import { Box, Checkbox } from "@mui/material";


function CountdownConfig(params=null) // params.id, params.config, params.callback
{
    const [ID, setID] = useState(-1);

    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    const [textColor, setTextColor] = useState((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
    const [displaySeconds, setDisplaySeconds] = useState((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false); // should the countdown display seconds
    
    function runCallback() {params.callback({"backgroundColor":backgroundColor, "textColor":textColor, "displaySeconds":displaySeconds});}

    useEffect(() =>
    {
        if (params.id != ID)
        {
            setID(params.id);
            runCallback();
        
            setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
            setTextColor((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
            setDisplaySeconds((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false); // should the countdown display seconds
        }
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor, textColor, displaySeconds]);


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
            <Box> {/* Seconds display selection */}
                <p>Display Seconds: </p>
                <Checkbox checked={displaySeconds} onChange={()=>{setDisplaySeconds(!displaySeconds);}}></Checkbox>
            </Box>
        </Box>
    );
}

export default CountdownConfig;