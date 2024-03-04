import React, { useState, useEffect } from "react";

import { SketchPicker } from "react-color";


// TODO: The "Color Pickers" should be deselected when a new component is chosen

// The component for configuring a "countdown widget" 
function CountdownConfig(params=null) // params.config, params.callback
{
    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    const [textColor, setTextColor] = useState((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
    const [displaySeconds, setDisplaySeconds] = useState((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false); // should the countdown display seconds
    const [displaySecondsLastMinute, setDisplaySecondsLastMinute] = useState((params.config && params.config.displaySecondsLastMinute) ? params.config.displaySecondsLastMinute : false); // should the seconds be displayed in the last minute of the countdown 

    const [displayBackgroundColorPicker, setDisplayBackgroundColorPicker] = useState("none");
    const [displayTextColorPicker, setDisplayTextColorPicker] = useState("none");
    const [displaySecondCheckbox, setDisplaySecondCheckbox] = useState("initial");


    function runCallback() {params.callback({"backgroundColor":backgroundColor, "textColor":textColor, "displaySeconds":displaySeconds, "displaySecondsLastMinute":displaySecondsLastMinute});}

    useEffect(() =>
    {
        if (!params.config) runCallback();

        setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
        setTextColor((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
        setDisplaySeconds((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false); // should the countdown display seconds
        setDisplaySecondsLastMinute((params.config && params.config.displaySecondsLastMinute) ? params.config.displaySecondsLastMinute : false); // should the seconds be displayed in the last minute of the countdown     

        setDisplaySecondCheckbox(((params.config && params.config.displaySeconds) ? params.config.displaySeconds : false) ? "none" : "initial");
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor, textColor, displaySeconds, displaySecondsLastMinute]);



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
                        setDisplaySecondCheckbox((displaySecondCheckbox === "none") ? "initial" : "none");
                    }
                }></input>
            </div>
            <div style={{display:displaySecondCheckbox}}> {/* Seconds display (for last minute) selection */}
                <p>Display Seconds (for the last minute): </p>
                <input type="checkbox" checked={displaySecondsLastMinute}
                    onChange={() => 
                    {
                        setDisplaySecondsLastMinute(!displaySecondsLastMinute);
                    }
                }></input>
            </div>
        </div>
    );
}

export default CountdownConfig;