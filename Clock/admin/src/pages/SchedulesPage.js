import React, { useState, useEffect } from "react";
import DraggableList from "react-draggable-list";

import ScheduleDropdown from "../components/ScheduleDropdown";
import PeriodEditor from "../components/PeriodEditor";

import "../styles/App.css";
import { Box, Button, Paper, TextField } from "@mui/material";


function SchedulesPage()
{
    const [schedules, setSchedules] = useState({}); // All the schedules (initially recieved from the server)
    const [selection, setSelection] = useState(null); // The name of the schedule currently being modified (or a new empty schedule)

    const [tempScheduleName, setTempScheduleName] = useState(""); // The name of the schedule can be set by the user if it is a new schedule
    const [tempSchedule, setTempSchedule] = useState([]); // the contents of the schedule being modified / created

    const [IDs, setIDs] = useState(new Set());
    const [nextID, setNextID] = useState(0);

    const baseURL = "http://localhost:8500/"; // This will likly need to be changed for a production build


    // TODO: and authorization header can be used to make sure that this user has admin credentials
    function updateServerSchedules(info) // Sends the schedules to the server 
    {
        fetch(`${baseURL}schedules`,
        {
            method:"PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });
    }


    // gets schedules JSON object from server
    useEffect(() => {
        fetch(`${baseURL}schedules`)
        .then((res) => res.json())
        .then((data) => {setSchedules(data);}
        );
    }, []);

    // called when a new schedule is selected from the schedule dropdown for modification
    function changeSelection(newSelection)
    {
        setSelection(newSelection);
        setTempScheduleName(newSelection);

        var newTempSchedule = [];
        if (newSelection !== null)
        {
            newTempSchedule = [... schedules[newSelection]];
        }

        const indexList = [];
        for (let i = 0; i < newTempSchedule.length; i++)
        {
            indexList.push(i);
            newTempSchedule[i].id = i;
        }

        setIDs(new Set(indexList));
        setNextID(indexList.length);
        setTempSchedule(newTempSchedule);
    }

    // If this is a new schedule, the schedule name can be chosen by the user
    function changeScheduleName(e)
    {
        setTempScheduleName(e.target.value);
    }

    // The function to get an draggable list of all of the created periods 
    function displayEditor()
    {
        return <DraggableList
            itemKey="id"
            template={PeriodEditor}
            list={tempSchedule}
            container={() => {return document.body;}}
            commonProps={periodEditUpdate}
            onMoveEnd={reposition}

            constrainDrag = {true}
        />;

        // Called whenever a PeriodEditor is modified. Updates the currently selected schedule accordingly.
        function periodEditUpdate(res)
        {
            var index = 0;

            const copiedTempSchedule = [...tempSchedule]; // create a shallow copy of tempSchedule to be modified
            for (let i = 0; i < copiedTempSchedule.length; i++)
            {
                if (copiedTempSchedule[i].id === res.id)
                {
                    index = i;
                }
            }

            if (res.delete)
            {
                copiedTempSchedule.splice(index, 1);
                const copiedIDs = new Set(IDs);
                copiedIDs.delete(res.id);
                setIDs(copiedIDs);
            }
            else
            {
                copiedTempSchedule[index] = res;
            }

            setTempSchedule(copiedTempSchedule);
        }

        function reposition(res)
        {
            setTempSchedule(res);
        }
    }

    function addPeriod() // Add on a new empty period
    {
        const newTempSchedule = [...tempSchedule]; 
        const p = {};
        p.name = "";
        p.start = newTempSchedule.length > 0 ? newTempSchedule[newTempSchedule.length - 1].end : "00:00";
        p.end = p.start;

        var done = false;
        var checkID = nextID;
        while (!done)
        {
            if (IDs.has(checkID) === false) done = true;
            else checkID++;
        }
        p.id = checkID;
        setNextID(checkID + 1);

        newTempSchedule.push(p);
        
        setTempSchedule(newTempSchedule);
    }

    // This function will return a button to delete the schedule if the user is modifying an old schedule (i.e. a prexisting schedule is selected)
    // BUT, will return a text input field for the schedule name if the user is creating a new schedule (i.e. empty is selected)
    function specialInput() // delete schedule or name schedule
    {
        // -- field for nameing schedule --
        if (selection === null) 
        {
            return <TextField variant="filled" label="New Schedule Name" value={tempScheduleName} onInput={changeScheduleName}></TextField>;
        }

        // -- button for deleteing schedule --
        return(
            <Button variant="contained" size="large" onClick={() => {
                if (window.confirm("Are you sure that you want to delete schedule \"" + selection + "\" ?"))
                {
                    const copiedSchedules = {...schedules}; // shallow copy
                    delete copiedSchedules[selection]; // delete the selected schedule from the objec storeing all the schedules

                    setSchedules(copiedSchedules); // update original
                    updateServerSchedules(copiedSchedules); // update the server with the new schedules JSON object
                    changeSelection(null); // set EMPTY as the current selection (i.e. the option to create a new schedule should be auto-selected now that the current schedule was deleted)
                }
            }}>DELETE SCHEDULE</Button>
        );
    }

    // check schedule validity and update the server with the new schedule JSON object
    function submitSchedule()
    {
        // -- check schedule validity -- (The user will not be allowed to submit and an error message will be displayed)
        if (tempScheduleName === null || tempScheduleName === "" || tempScheduleName === "NEW SCHEDULE") // invalid schedule name
        {
            window.alert("Invalid Schedule Name!");
            return;
        }

        if (selection === null && schedules[tempScheduleName]) // Schedule name already exists (no duplicate schedules)
        {
            window.alert("Invalid Schedule Name!\nThe Schedule \"" + tempScheduleName + "\" Already Exists!");
            return;
        }

        if (!tempSchedule || tempSchedule.length === 0) // the schedule is empty
        {
            window.alert("Input Periods!");
            return;
        }

        // Check to see if the period start/end times conflict
        var prevTime = "00:00";
        for (let i = 0; i < tempSchedule.length; i++)
        {
            if (tempSchedule[i].start >= prevTime)
            {
                prevTime = tempSchedule[i].start;
            }
            else
            {
                window.alert("Invalid Start Time: (row " + (i + 1) + ")");
                return;
            }
            if (tempSchedule[i].end >= prevTime)
            {
                prevTime = tempSchedule[i].end;
            }
            else
            {
                window.alert("Invalid End Time: (row " + (i + 1) + ")");
                return;
            }
        }

        // -- update server & reset states --
        const copiedSchedules = {...schedules};
        copiedSchedules[tempScheduleName] = spliceScheduleIDs(tempSchedule);
        setSchedules(copiedSchedules);
        updateServerSchedules(copiedSchedules);
        changeSelection(null);

        if (selection === null) // if this is a completely new schedule
        {
            window.alert("Added New Schedule");
        }
        else if (selection === tempScheduleName) // if an prexisting schdule is being modified
        {          
            window.alert("Updated Schedule");
        }
    }

    function spliceScheduleIDs(sch)
    {
        const copy = [... sch];

        for (let i = 0; i < copy.length; i++)
        {
            copy[i] = {"name":copy[i].name, "start":copy[i].start, "end":copy[i].end};
        }

        return copy;
    }


    return(
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh", marginBottom: 3}}>
                <h1>Schedules</h1>
            </Box>
            
            <Paper elevation={7} sx={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 3, padding: 1, width: "14cm", maxWidth: "90%"}}>
                <Box sx={{display: "flex", marginBottom: 1}}>
                    <Box sx={{marginRight: 1}}>
                        <ScheduleDropdown schedules={schedules} nullSelectionName={"NEW SCHEDULE"} defaultValue={selection} callback={changeSelection}/>
                    </Box>
                    {specialInput()}
                </Box>

                <Box sx={{width: "100%"}}>
                    {displayEditor()}
                </Box>

                <Box>
                    <Button variant="outlined" onClick={addPeriod}>Add Period</Button>
                </Box>
            </Paper>

            <Button variant="contained" size="large" onClick={submitSchedule}>Submit form</Button>
        </Box>
    );
}

export default SchedulesPage;