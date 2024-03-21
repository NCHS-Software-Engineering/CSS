import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

function TextboxConfig(params=null) // params.config, params.callback
{
    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    const [textColor, setTextColor] = useState((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text

    const [displayBackgroundColorPicker, setDisplayBackgroundColorPicker] = useState("none");
    const [displayTextColorPicker, setDisplayTextColorPicker] = useState("none");

    const [inputValue, setInputValue] = useState('');
    const [savedValue, setSavedValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSaveClick = () => {
        setSavedValue(inputValue);
    };

    function runCallback() {params.callback({"backgroundColor":backgroundColor, "textColor":textColor, "savedValue": savedValue});}

    useEffect(() =>
    {
        if (!params.config) runCallback();

        setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
        setTextColor((params.config && params.config.textColor) ? params.config.textColor : "#000000"); // rgb color of text
    }, [params]);

    useEffect(() =>
    {
        runCallback();
    }, [backgroundColor, textColor, savedValue]);

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
            <div> {/* Text input and save button */}
                <input type="text" value={inputValue} onChange={handleInputChange} />
                <button onClick={handleSaveClick}>Save</button>
            </div>
        </div>
    );
}

export default TextboxConfig;