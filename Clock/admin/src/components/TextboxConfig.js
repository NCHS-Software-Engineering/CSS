import React, { useState, useEffect } from "react";
import { MuiColorInput } from 'mui-color-input'
import { Box, TextField } from "@mui/material";


function TextboxConfig(params=null) // params.config, params.callback
{
    const [ID, setID] = useState(-1);

    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    const [textColor, setTextColor] = useState((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
    const [text, setText] = useState((params.config && params.config.text) ? params.config.text : "");
    
    function runCallback() {params.callback({"backgroundColor":backgroundColor, "textColor":textColor, "text":text});}

    useEffect(() =>
    {
        if (params.id != ID)
        {
            setID(params.id);
            if (!params.config || backgroundColor === params.config.backgroundColor && textColor === params.config.textColor && text === params.config.text) runCallback();

            setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
            setTextColor((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
            setText((params.config && params.config.text) ? params.config.text : "");
        }
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor, textColor, text]);


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
            <Box sx={{marginBottom: 1}}> {/* Text input */}
                <p>Text: </p>
                <TextField sx={{width: "100%"}}
                    multiline 
                    minRows={2} 
                    maxRows={6} 
                    value={text}
                    onChange={(e) => {setText(e.target.value);}}
                />
            </Box>
        </Box>
    );
}

export default TextboxConfig;