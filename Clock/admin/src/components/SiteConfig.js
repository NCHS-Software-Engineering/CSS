import React, { useState, useEffect } from "react";

import { SketchPicker } from "react-color";


// TODO: The "Color Pickers" should be deselected when a new component is chosen

// The component for configuring a "clock widget" 
function SiteConfig(params=null) // params.config, params.callback
{
    const [backgroundColor, setBackgroundColor] = useState((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background

    const [displayBackgroundColorPicker, setDisplayBackgroundColorPicker] = useState("none");

    useEffect(() =>
    {
        setBackgroundColor((params.config && params.config.backgroundColor) ? params.config.backgroundColor : "#ffffff"); // rgb color of background
    }, [params]);

    useEffect(() =>
    {
        params.callback({"backgroundColor":backgroundColor});
    }, [backgroundColor]);


    return (
        <div>
            <div> {/* Background color selection */}
                <button 
                    onClick={() =>
                        {
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
        </div>
    );
}

export default SiteConfig;