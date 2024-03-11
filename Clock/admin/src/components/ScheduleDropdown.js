import { MenuItem, Select } from "@mui/material";
import React, { useState, useEffect } from "react";


function ScheduleDropdown(props = null) // props.defaultValue, props.callback, props.nullSelectionName, props.schedules
{
    const [schedules, setSchedules] = useState({}); // All of the created schedules
    const [selection, setSelection] = useState(""); // The name of the selected schedule
    const [nullSelectionName, setNullSelectionName] = useState("");


    // Initially get the schedules from the server
    useEffect(() => {
        setSchedules(props.schedules);
        setSelection(props.defaultValue);
        setNullSelectionName(props.nullSelectionName);
    }, [props]);


    // Returns a list of all of the schedule names as options
    function displayDropdown()
    {
        const sortedKeys = Object.keys(schedules).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        return sortedKeys.map((item) => {return <MenuItem value={item}>{item}</MenuItem>;});
    }

    // Runs whenever a new schedule is selected from the dropdown
    function updateSelection(e)
    {
        setSelection(e.target.value);

        // send the selected schedule back to the parent component using a callback
        props.callback(e.target.value)
    }


    return (
        <Select variant="filled" onChange={updateSelection} value={selection} sx={{width: 250}}> 
            <MenuItem value={null}>{nullSelectionName}</MenuItem> 
            {displayDropdown()} 
        </Select>
    );
}

export default ScheduleDropdown;
















/*






import React, { useState, useEffect } from "react";


function ScheduleDropdown(props = null) // props.defaultValue, props.callback, props.nullSelectionName
{
    const [schedules, setSchedules] = useState({}); // All of the created schedules
    const [selection, setSelection] = useState(props.defaultValue); // The name of the selected schedule

    const baseURL = "http://localhost:8500/"; // This will likely need to be changed for a production build

    // Initially get the schedules from the server
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
            if (item === props.defaultValue) // The defaultValue passed by the parent component should be the default selection
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
            if (props && props.callback)
            {
                // send the selected schedule back to the parent component using a callback
                props.callback((e.target.value === props.nullSelectionName || e.target.value === "null" || e.target.value === null) ? null : e.target.value)
            }
        }
    }


    return (
        <select className="select" id="dropdown" onChange={updateSelection} onClick={getSchedules}> 
            <option value={null} style={{ fontWeight: 'bold' }}>{props.nullSelectionName}</option> 
            {displayDropdown()} 
        </select>
    );
}

export default ScheduleDropdown;

*/