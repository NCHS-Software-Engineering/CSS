import React, { useState, useEffect } from "react";


function ScheduleDropdown(params = null) // params.defaultValue, params.callback
{
    const [schedules, setSchedules] = useState({}); // All of the created schedules
    const [selection, setSelection] = useState(params.defaultValue); // The name of the selected schedule

    const baseURL = "http://localhost:8500/"; // This will likly need to be changed for a production build

    // Initialy get the schedules from the server
    useEffect(() => {
        getSchedules();
    }, []);

    // gets schedules from server
    function getSchedules()
    {
        fetch(`${baseURL}schedules`)
        .then((res) => res.json())
        .then((data) => {setSchedules(data);}
        );
    }

    // Returns a list of all of the schedule names as options
    function displayDropdown()
    {
        const sortedKeys = Object.keys(schedules).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        return sortedKeys.map((item) => {
            if (item === params.defaultValue) // The defaultValue passed by the parent component should be the default selection
            {
                return <option key={item} value={item} selected>{item}</option>
            }
            return <option key={item} value={item}>{item}</option>
        });
    }

    // Runs whenever a new schedule is selected from the dropdown
    function updateSelection(e)
    {
        if (e.target.value !== selection)
        {
            setSelection(e.target.value);
            if (params && params.callback)
            {
                // send the selected schedule back to the parent component using a callback
                params.callback((e.target.value === "EMPTY" || e.target.value === "null" || e.target.value === null) ? null : e.target.value)
            }
        }
    }


    return (
        <select className="select" id="dropdown" onChange={updateSelection} onClick={getSchedules}> 
            <option value={null} style={{ fontWeight: 'bold' }}>EMPTY</option> {/* Should always be an EMPTY schedule with a value of null */}
            {displayDropdown()} 
        </select>
    );
}

export default ScheduleDropdown;