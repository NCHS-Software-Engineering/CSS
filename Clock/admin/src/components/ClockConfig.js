import React, { useState, useEffect } from "react";

import { SketchPicker } from "react-color";


// TODO: The "Color Pickers" should be deselected when a new component is chosen

// The component for configuring a "clock widget" 
function ClockConfig(params=null) // params.config, params.callback
{
    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    const [textColor, setTextColor] = useState((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
    const [displaySeconds, setDisplaySeconds] = useState((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false); // should the countdown display seconds

    const [displayBackgroundColorPicker, setDisplayBackgroundColorPicker] = useState("none");
    const [displayTextColorPicker, setDisplayTextColorPicker] = useState("none");

    
    function runCallback() {params.callback({"backgroundColor":backgroundColor, "textColor":textColor, "displaySeconds":displaySeconds});}

    useEffect(() =>
    {
        if (!params.config) runCallback();

        setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
        setTextColor((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
        setDisplaySeconds((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false); // should the countdown display seconds

        //setDisplayBackgroundColorPicker("none");
        //setDisplayTextColorPicker("none");
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor, textColor, displaySeconds]);


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
            <div> {/* Seconds display selection */}
                <p>Display Seconds: </p>
                <input type="checkbox" checked={displaySeconds}
                    onChange={ () => 
                    {
                        setDisplaySeconds(!displaySeconds);
                    }
                }></input>
            </div>
        </div>
    );
}

export default ClockConfig;