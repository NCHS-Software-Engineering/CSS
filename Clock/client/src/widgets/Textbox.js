import React, { useState, useEffect} from "react";

function Textbox(props = null) // props.col, props.row, props.width, props.height, props.config
{
    const [col, setCol] = useState(1);
    const [row, setRow] = useState(1);
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);
  
    useEffect(() => {
        setCol(props.col + 1);
        setRow(props.row + 1);
        setWidth(props.width);
        setHeight(props.height);
    }, [props]);

    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    
    return(
        <div className="Widget"
            style=
            {{
                backgroundColor: props.config.backgroundColor,
                color: props.config.textColor,
                "gridColumnStart": col,
                "gridColumnEnd": col+width,
                "gridRowStart": row,
                "gridRowEnd": row+height
            }}
        >
            <input type="text" value={value} onChange={handleChange} />
        </div>
    )    
}

export default Textbox;