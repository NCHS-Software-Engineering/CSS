import React, { useState, useEffect } from "react";

import { SketchPicker } from "react-color";


// TODO: The "Color Pickers" should be deselected when a new component is chosen

// The component for configuring a "clock widget" 
function WeatherConfig(params=null) // params.config, params.callback
{
    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    const [textColor, setTextColor] = useState((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text

    const [displayBackgroundColorPicker, setDisplayBackgroundColorPicker] = useState("none");
    const [displayTextColorPicker, setDisplayTextColorPicker] = useState("none");


    function runCallback() {params.callback({"backgroundColor":backgroundColor, "textColor":textColor});}

    useEffect(() =>
    {
        if (!params.config) runCallback();

        setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
        setTextColor((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor, textColor]);


    return (
        <div>
            <div> {/* Background color selection */}
                <button 
                    onClick={() =>
                        {
                            setDisplayTextColorPicker("none");
                            setDisplayBackgroundColorPicker((displayBackgroundColorPicker === "none") ? "initial" : "none");
                        }
                    }
                >Background Color</button>
                <div style={{display:displayBackgroundColorPicker, position:"absolute", zIndex:2}}>
                    <SketchPicker 
                        color={backgroundColor}
                        onChangeComplete={(newColor) => {setBackgroundColor(newColor.hex);}} 
                    />
                </div>
            </div>
            <div> {/* Text color selection */}
                <button 
                    onClick={() =>
                        {
                            setDisplayBackgroundColorPicker("none");
                            setDisplayTextColorPicker((displayTextColorPicker === "none") ? "initial" : "none");
                        }
                    }
                >Text Color</button>
                <div style={{display:displayTextColorPicker, position:"absolute", zIndex:2}}>
                    <SketchPicker 
                        color={textColor}
                        onChangeComplete={(newColor) => {setTextColor(newColor.hex);}} 
                    />
                </div>
            </div>
        </div>
    );
}

export default WeatherConfig;