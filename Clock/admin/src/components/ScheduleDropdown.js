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