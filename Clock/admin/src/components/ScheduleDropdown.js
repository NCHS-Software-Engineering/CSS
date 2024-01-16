import React, { useState, useEffect } from "react";


// TODO: will need to take a parameter for the initial "selection" value
// TODO: will need a way for the parent of this component to access the "selection" value
function ScheduleDropdown(params = null) // params.defaultValue, params.callback
{
    const [schedules, setSchedules] = useState({});
    const [selection, setSelection] = useState(params.defaultValue);

    const baseURL = "http://localhost:8500/"; // This will likly need to be changed for a production build

    useEffect(() => {
        getSchedules();
    }, []);

    function getSchedules()
    {
        fetch(`${baseURL}schedules`)
        .then((res) => res.json())
        .then((data) => {setSchedules(data);}
        );
    }


    function displayDropdown()
    {
        const sortedKeys = Object.keys(schedules).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        return sortedKeys.map((item) => {
            if (item === params.defaultValue)
            {
                return <option key={item} value={item} selected>{item}</option>
            }
            return <option key={item} value={item}>{item}</option>
        });
    }

    function updateSelection(e)
    {
        if (e.target.value !== selection)
        {
            setSelection(e.target.value);
            if (params && params.callback)
            {
                params.callback((e.target.value === "EMPTY" || e.target.value === "null" || e.target.value === null) ? null : e.target.value)
            }
        }
    }


    return (
        <select id="dropdown" onChange={updateSelection} onClick={getSchedules}> 
            <option value={null} style={{ fontWeight: 'bold' }}>EMPTY</option>
            {displayDropdown()} 
        </select>
    );
}

export default ScheduleDropdown;