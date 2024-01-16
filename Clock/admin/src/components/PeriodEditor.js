import React, { useState, useEffect } from "react";

//TODO: restrict time within a min / max range (might be easier to do in SchedulesPage???)
function PeriodEditor(params = null) // param.id, params.name, params.start, params.end, params.callback
{
    const [name, setName] = useState("");
    const [start, setStart] = useState("0:00");
    const [end, setEnd] = useState("23:59");

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
                <input type="text" id={"name" + params.id} placeholder="Period Name" onInput={updateName}></input>
            </td>
            <td>
                <input type="time" id={"start" + params.id} onChange={updateStart}></input>
            </td>
            <td>
                <input type="time" id={"end" + params.id} onChange={updateEnd}></input>
            </td>
        </tr>
    );
}

export default PeriodEditor;