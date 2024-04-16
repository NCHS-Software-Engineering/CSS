import React, { useState, useEffect } from "react";
import { MuiColorInput } from 'mui-color-input'
import { Box, Checkbox, Slider } from "@mui/material";


function CountdownConfig(params=null) // params.id, params.config, params.callback
{
    const [ID, setID] = useState(-1);

    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    const [blinkColor, setBlinkColor] = useState((params.config && params.config.blinkColor) ? params.config.blinkColor : "#ffffff"); // rgb color of blink
    const [textColor, setTextColor] = useState((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
    const [displaySeconds, setDisplaySeconds] = useState((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false); // should the countdown display seconds
    
    function runCallback() {params.callback({"backgroundColor":backgroundColor, "textColor":textColor, "displaySeconds":displaySeconds, "blinkColor":blinkColor});}

    useEffect(() =>
    {
        if (params.id != ID)
        {
            setID(params.id);
            if (!params.config || backgroundColor === params.config.backgroundColor && textColor === params.config.textColor && displaySeconds === params.config.displaySeconds) runCallback();
        
            setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
            setBackgroundColor((params.config && params.config.blinkColor) ? params.config.blinkColor : "#ffffff"); // rgb color of background
            setTextColor((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
            setDisplaySeconds((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false); // should the countdown display seconds
        }
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor, textColor, displaySeconds, blinkColor]);


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

            <Box sx={{display: "flex", justifyContent: "center"}}>
                <p>Blink Slider: </p>
                <Slider min={0} max={10} step={1} marks valueLabelDisplay="auto" sx={{width: "90%"}}></Slider>
            </Box>

            <Box sx={{marginBottom: 1}}> {/* Blink color selection */}
                <p>Blink Color: </p>
                <MuiColorInput  
                    format="hex"
                    value={blinkColor}
                    onChange={(newColor) => {setBlinkColor(newColor);}} 
                />
            </Box>
        </Box>
    );
}

export default CountdownConfig;