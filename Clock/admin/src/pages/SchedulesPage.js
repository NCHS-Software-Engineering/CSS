import React, { useState, useEffect } from "react";
import DraggableList from "react-draggable-list";

import PeriodEditor from "../components/PeriodEditor";

import "../styles/App.css";
import { Box, Button, Divider, Grid, Modal, Paper, TextField } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useSearchParams } from 'react-router-dom';


function SchedulesPage()
{
    const [searchParams] = useSearchParams();

    const [overlay, setOverlay] = useState(false);

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
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({room:searchParams.get("room"), data:info, token:document.cookie.substring(document.cookie.indexOf("token=")+6, document.cookie.indexOf("token=")+27)})
        });
    }


    // gets schedules JSON object from server
    useEffect(() => {
        fetch(`${baseURL}schedules?room=`+searchParams.get("room"))
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
            newTempSchedule = [...schedules[newSelection]];
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


    // check schedule validity and update the server with the new schedule JSON object
    function submitSchedule()
    {
        // -- check schedule validity -- (The user will not be allowed to submit and an error message will be displayed)
        if (tempScheduleName === null || tempScheduleName === "" || tempScheduleName === "NEW SCHEDULE") // invalid schedule name
        {
            window.alert("Invalid Schedule Name!");
            return;
        }

        if (selection !== tempScheduleName && schedules[tempScheduleName]) // Schedule name already exists (no duplicate schedules)
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
        if (selection !== null && selection !== tempScheduleName)
        {
            delete copiedSchedules[selection];
        }
        setSchedules(copiedSchedules);
        updateServerSchedules({"schedules":copiedSchedules, "oldName":selection, "newName":tempScheduleName});
        changeSelection(null);
        setOverlay(false);

        if (selection === null) // if this is a completely new schedule
        {
            window.alert("Added New Schedule");
        }
        else if (selection === tempScheduleName) // if an prexisting schdule is being modified
        {          
            window.alert("Updated Schedule");
        }
        else // if this is a renamed schedule
        {
            window.alert("Renamed/Updated Schedule");
        }
    }

    function spliceScheduleIDs(sch)
    {
        const copy = [...sch];

        for (let i = 0; i < copy.length; i++)
        {
            copy[i] = {"name":copy[i].name, "start":copy[i].start, "end":copy[i].end};
        }

        return copy;
    }

    // allows for the selection of schedules
    function generateScheduleCards()
    {
        const resList = [];

        const orderedNames = []; // the schedule names in order by ASCII character
        for (const entry in schedules)
        {
            orderedNames.push(entry+"");
        }
        // bubble sort
        var changed = true;
        while (changed)
        {
            changed = false;
            for (let i = 0; i < orderedNames.length - 1; i++)
            {
                if (orderedNames[i] > orderedNames[i+1])
                {
                    changed = true;
                    const temp = orderedNames[i+1];
                    orderedNames[i+1] = orderedNames[i];
                    orderedNames[i] = temp;
                }
            }
        }

        // generate the cards for all existing schedules
        for (const i in orderedNames)
        {
            const entry = orderedNames[i];

            resList.push(
                <Grid item xs={2}>
                    <Paper elevation={10} sx={{aspectRatio: 1, display: "flex", flexDirection: "column"}}>
                        <Box sx={{textAlign: "center", alignContent: "center", height: "20%"}}>
                            <h2>{entry}</h2>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", height: "80%"}}>
                            <Divider />
                            <Button sx={{width: "100%", height:"50%"}} variant="text" onClick={() => {changeSelection(entry); setOverlay(true);}}>Edit</Button>
                            <Divider />
                            <Button sx={{width: "100%", height:"50%"}} variant="text"
                                onClick={() => {
                                if (window.confirm("Are you sure that you want to delete schedule \"" + entry + "\" ?"))
                                {
                                    const copiedSchedules = {...schedules}; // shallow copy
                                    delete copiedSchedules[entry]; // delete the selected schedule from the objec storeing all the schedules

                                    setSchedules(copiedSchedules); // update original
                                    updateServerSchedules({"schedules":copiedSchedules, "oldName":entry, "newName":entry}); // update the server with the new schedules JSON object
                                    changeSelection(null); // set EMPTY as the current selection (i.e. the option to create a new schedule should be auto-selected now that the current schedule was deleted)
                                }
                            }}>Delete</Button>
                        </Box>
                    </Paper>
                </Grid>
            )
        }

        // generate a card for adding a new schedule
        resList.push(
            <Grid item xs={2}>
                <Box sx={{aspectRatio: 1, display: "flex", flexDirection: "column", border: 5, borderStyle: "dashed", borderRadius: 4}}>
                    <Button variant="text" sx={{width: "100%", height: "100%"}}
                        onClick={() => {
                        changeSelection(null); 
                        setOverlay(true);
                    }}><AddRoundedIcon sx={{width: "50%", height: "50%"}}/></Button>
                </Box>
            </Grid>
        )

        // return the cards
        return resList;
    }

    // TODO: actualy check if there were any changes before prompting
    function closeOverlay()
    {
        if (window.confirm("Unsaved changes will be lost.\nAre you sure you want to exit?"))
            setOverlay(false);
    }


    return(
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh", marginBottom: 3}}>
                <h1>Schedules</h1>
            </Box>
            
            <Box sx={{width: "90%"}}>
                <Grid container spacing={2}>
                    {generateScheduleCards()}
                </Grid>
            </Box>

            <Modal
                sx={{
                    display: "flex",
                    marginTop: 5,
                    justifyContent: "center",
                    overflowY: "scroll"
                }}
                open={overlay}
                onClose={() => closeOverlay()}
            >
                <Box sx={{display: "flex", flexDirection: "column", width: "14cm", maxWidth: "90%"}}>
                    <Paper elevation={7} sx={{display: "flex", flexDirection: "column", alignItems: "center", padding: 1, width: "100%"}}>
                        <Box sx={{display: "flex", marginBottom: 1}}>
                            <TextField variant="filled" label="Schedule Name" value={tempScheduleName} onInput={changeScheduleName}></TextField>
                        </Box>

                        <Box sx={{width: "100%"}}>
                            {displayEditor()}
                        </Box>

                        <Button variant="outlined" onClick={addPeriod}>Add Period</Button>

                        <Divider sx={{marginTop: 1, marginBottom: 1, width:"100%"}}/>

                        <Button variant="contained" size="large" onClick={() => {submitSchedule()}}>Save</Button>
                    </Paper>
                </Box>
            </Modal>
        </Box>
    );
}

export default SchedulesPage;