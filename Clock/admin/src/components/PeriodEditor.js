import React, { useState, useEffect } from "react";


function PeriodEditor(params = null) // param.id, params.name, params.start, params.end, params.callback
{
    const [name, setName] = useState(""); // The name of this period
    const [start, setStart] = useState("00:00"); // the start time of this period
    const [end, setEnd] = useState("23:59"); // the end time of this period

    // runs once at startup, initializes states as per the parameters passed by the parent component
    useEffect(() => {
        if (params)
        {
            if (params.name)
            {
                setName(params.name);
                document.getElementById("name" + params.id).value = params.name;
            }
            if (params.start)
            {
                setStart(params.start);
                document.getElementById("start" + params.id).value = params.start;
            }
            if (params.end)
            {
                setEnd(params.end);
                document.getElementById("end" + params.id).value = params.end;
            }
        }
    },[]);

    // The following functions are called when an edit to the period is made. A callback is sent to the parent component.
    function updateName()
    {
        const element = document.getElementById("name" + params.id);

        if (element.value !== name)
        {
            setName(element.value);
        }
        
        if (params && params.callback)
        {
            const res = {"id":params.id, "name":element.value, "start":start, "end":end};

            params.callback(res);
        }
    }
    function updateStart()
    {
        const element = document.getElementById("start" + params.id);

        if (element.value !== start)
        {
            setStart(element.value);
        }
        
        if (params && params.callback)
        {
            const res = {"id":params.id, "name":name, "start":element.value, "end":end};

            params.callback(res);
        }
    }
    function updateEnd()
    {
        const element = document.getElementById("end" + params.id);

        if (element.value !== end)
        {
            setEnd(element.value);
        }
        
        if (params && params.callback)
        {
            const res = {"id":params.id, "name":name, "start":start, "end":element.value};

            params.callback(res);
        }
    }


    return(
        <tr key={params.id}>
            <td>
                <input className="box" type="text" id={"name" + params.id} placeholder="Period Name" onInput={updateName}></input>
            </td>
            <td>
                <input className="box" type="time" id={"start" + params.id} onChange={updateStart}></input>
            </td>
            <td>
                <input className="box" type="time" id={"end" + params.id} onChange={updateEnd}></input>
            </td>
        </tr>
    );
}

export default PeriodEditor;