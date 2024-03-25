import React, { useState, useEffect} from "react";

// NOTE: assumes a 16 by 9 grid
function ScaleText(props = null) // props.id, props.portionFilled, props.justify, props.text, props.width, props.height
{
    const [portionFilled, setPortionFilled] = useState(0.9); // fill x% of width or height
    const [justify, setJustify] = useState("center");

    const [ID, setID] = useState("");

    const [text, setText] = useState(""); // the text to display
    const [textLength, setTextLength] = useState(0); // the number of characters in the text (NOTE: all characters must be the same width !!!)
    const [fontSize, setFontSize] = useState(12); // the font size of the text

    const [windowWidth, setWindowWidth] = useState(1);
    const [windowHeight, setWindowHeight] = useState(1);

    const[width, setWidth] = useState(1); // the number of columns spanned
    const[height, setHeight] = useState(1); // the number of rows spanned


    useEffect (() => {
        setID(props.id);
        if (props.portionFilled) setPortionFilled(props.portionFilled);
        if (props.justify) setJustify(props.justify);
        setText(props.text); 
        setTextLength(props.text.length);
        setWidth(props.width);
        setHeight(props.height);
    }, [props]);

    useEffect(() => {
        if (textLength !== 0)
        {
            resize();
        }
    }, [textLength, width, height, windowWidth, windowHeight, portionFilled, ID]);

    // TODO: This code is VERY SUBOPTIMAL. resize is calculated like every second
    useEffect(() => {
        if (textLength !== 0)
        {
            resize();
        }
    });

    useEffect(() => {
        windowResize();
        window.addEventListener("resize", () => {windowResize();})
        return () => {window.removeEventListener("resize", () => {windowResize();});}
    }, []);

    
    function windowResize()
    {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
    }

    function resize()
    {
        var tempFontSize = fontSize;

        const ratio = (windowHeight * (height / 9)) / document.getElementById(ID+"text").scrollHeight;
        
        tempFontSize *= ratio;
        if (document.getElementById(ID+"text").scrollWidth * ratio > (windowWidth * (width / 16))) // resize if overflow
        {
            tempFontSize *= (windowWidth * (width / 16)) / (document.getElementById(ID+"text").scrollWidth * ratio);
        }
        tempFontSize *= portionFilled;

        if (Math.abs(tempFontSize - fontSize) > 1) setFontSize(tempFontSize);
    }


    return (
        <div id={ID+"container"} style={{display: "flex", alignItems: "center", justifyContent:justify, width: "100%", height: "100%"}}>
            <p id={ID+"text"} style={{display: "inline-block", fontSize: fontSize, overflow: "hidden"}}>{text}</p>
        </div>
    );
}

export default ScaleText;