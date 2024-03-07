import React, { useState, useEffect } from "react";


function PeriodEditor(props = null) // props.item.id, props.item.name, props.item.start, props.item.end, props.commonProps
{
    const [name, setName] = useState(""); // The name of this period
    const [start, setStart] = useState("00:00"); // the start time of this period
    const [end, setEnd] = useState("23:59"); // the end time of this period

    // runs once at startup, initializes states as per the parameters passed by the parent component
    useEffect(() => {
        if (props.item.name)
        {
            setName(props.item.name);
            document.getElementById("name" + props.item.id).value = props.item.name;
        }
        if (props.item.start)
        {
            setStart(props.item.start);
            document.getElementById("start" + props.item.id).value = props.item.start;
        }
        if (props.item.end)
        {
            setEnd(props.item.end);
            document.getElementById("end" + props.item.id).value = props.item.end;
        }
    },[props]);

    // The following functions are called when an edit to the period is made. A callback is sent to the parent component.
    function updateName()
    {
        const element = document.getElementById("name" + props.item.id);

        if (element.value !== name)
        {
            setName(element.value);
        }
        
        if (props.item && props.item.callback)
        {
            const res = {"id":props.item.id, "name":element.value, "start":start, "end":end};

            props.commonProps(res);
        }
    }
    function updateStart()
    {
        const element = document.getElementById("start" + props.item.id);

        if (element.value !== start)
        {
            setStart(element.value);
        }
        
        if (props.item && props.item.callback)
        {
            const res = {"id":props.item.id, "name":name, "start":element.value, "end":end};

            props.commonProps(res);
        }
    }
    function updateEnd()
    {
        const element = document.getElementById("end" + props.item.id);

        if (element.value !== end)
        {
            setEnd(element.value);
        }
        
        if (props.item && props.item.callback)
        {
            const res = {"id":props.item.id, "name":name, "start":start, "end":element.value};

            props.commonProps(res);
        }
    }


    return(
        <table>
        <tbody>
        <tr>
            <td {... props.dragHandleProps }>
                =
            </td>
            <td>
                <input className="box" type="text" id={"name" + props.item.id} placeholder="Period Name" onInput={updateName}></input>
            </td>
            <td>
                <input className="box" type="time" id={"start" + props.item.id} onChange={updateStart}></input>
            </td>
            <td>
                <input className="box" type="time" id={"end" + props.item.id} onChange={updateEnd}></input>
            </td>
            <td>
                <button onClick={() => {props.commonProps({delete:true, id:props.item.id});}}> del </button>
            </td>
        </tr>
        </tbody>
        </table>
    );
}

export default PeriodEditor;