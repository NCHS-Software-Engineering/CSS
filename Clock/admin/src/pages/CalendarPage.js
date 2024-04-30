import React, { useState, useEffect } from "react";

import ScheduleDropdown from "../components/ScheduleDropdown";

import { Box, Button, ButtonGroup, MenuItem, Paper, Select } from "@mui/material";
import { useSearchParams } from 'react-router-dom';


// TODO: User feedback is important! (through CSS maybe?)
function CalendarPage()
{
    const [searchParams] = useSearchParams();

    const [calendar, setCalendar] = useState({}); // the calendar storing all special schedules (initially from the server)
    const [schedules, setSchedules] = useState({});

    const [tableMonth, setTableMonth] = useState(0); // The current month being viewed ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] --> [January, February, March, April, May, ...])

    const [selectedDateKey, setSelectedDateKey] = useState(-1); // represents the date selected. Each date of the year has a unique datekey. (e.g. November 17th --> 1017)


    const today = new Date(); // todays date/time info
    const baseURL = "http://localhost:8500/"; // This will likely need to be changed for a production build


    // TODO: and authorization header can be used to make sure that this user has admin credentials
    function updateServerCalendar(info) // Sends the calendar to the server 
    {
        fetch(`${baseURL}calendar`,
        {
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({room:searchParams.get("room"), data:info, token:document.cookie.substring(document.cookie.indexOf("token=")+6, document.cookie.indexOf("token=")+27)})
        });
    }


    // The displayed calendar should initialy show today's month and have today's date selected
    useEffect(() =>
    {
        resetToToday();
    }, []);

    // brings the calendar UI back to today's month with taday's date selected
    function resetToToday()
    {
        setTableMonth(today.getMonth());
        setSelectedDateKey((today.getMonth() * 100) + today.getDate());
    }


    // gets calendar JSON object from server
    useEffect(() => {
        fetch(`${baseURL}calendar?room=`+searchParams.get("room"))
        .then((res) => res.json())
        .then((data) => {setCalendar(data);}
        );
    }, []);

    // gets schedules JSON object from server
    useEffect(() => {
        fetch(`${baseURL}schedules?room=`+searchParams.get("room"))
        .then((res) => res.json())
        .then((data) => {setSchedules(data);}
        );
    }, []);


    // Converts a months number value as per the 'Date' class to the name of the month as a string
    function numToMonth(month)
    {
        switch (month)
        {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December";
        }
        return "UNKNOWN";
    }

    function getSelectedDateString()
    {
        return numToMonth(Math.floor(selectedDateKey / 100)) + " " + (selectedDateKey % 100); // converts a datekey to a (Month Day) string 
    }

    // The calendar UI viewed and interacted with by the user
    function displayMonth(month)
    {
        const firstDay = new Date(today); firstDay.setDate(1); firstDay.setMonth(month); // the first day of this month
        const lastDay = new Date(firstDay); lastDay.setMonth(firstDay.getMonth() + 1); lastDay.setDate(0); // the last day of this month

        var firstDisplayed = new Date(firstDay.getTime()); // The first day displayed on this page of the calendar
        while (firstDisplayed.getDay() !== 0) firstDisplayed.setDate(firstDisplayed.getDate() - 1); // determine firstDisplayed
        var lastDisplayed = new Date(lastDay.getTime()); // The last day displayed on this page of the calendar
        while (lastDisplayed.getDay() !== 6) lastDisplayed.setDate(lastDisplayed.getDate() + 1); // determine lastDisplayed

        const tableRows = []; // Each row is a week of the selected month

        const incrementDate = new Date(firstDisplayed.getTime()); // This date object will be incremented from firstDisplayed to lastDisplayed to generate the calendar UI
        while (lastDisplayed.getTime() - incrementDate.getTime() >= 0)
        {
            const rowEntries = []; // An individual week
            for (let day = 0; day < 7; day++, incrementDate.setDate(incrementDate.getDate() + 1)) // go one week at a time
            {
                const dateKey = (incrementDate.getMonth() * 100) + incrementDate.getDate(); // calculate dateKey for that date

                var backgroundStyle = {}; // shading in for user feedback (i.e. default schedule, 1 time special schedule, or reapeating special schedule)
                var selectedStyle = {fontWeight:"normal"}; // Give user feedback as to which date is currently selected for editing
                var schName = ""; // The name of the "Special Schedule" for that day (if any)

                if (incrementDate.getMonth() !== month) backgroundStyle = {backgroundColor:"#aaaaaa"};

                if (calendar[dateKey]) // determine backgroundStyle
                {
                    if (calendar[dateKey].repeating)
                    {
                        backgroundStyle = {background:"#cbc3e3"};
                    }
                    else
                    {
                        backgroundStyle = {background:"#ffcccb"};
                    }
                }
                if (dateKey === selectedDateKey) // determine if this date is the selected date
                {
                    selectedStyle = {fontWeight:"bold"};
                }
                
                if (calendar[dateKey]) // determine the schedule name to be displayed (only if this date has a special schedule)
                {
                    if (calendar[dateKey])
                    {
                        if (calendar[dateKey].schedule === null) schName = "NO SCHEDULE";
                        else schName = calendar[dateKey].schedule;
                    }
                }
                
                // create a calendar UI entry that updates the 'dateKey' state when pressed
                rowEntries.push(
                    <td style={{...backgroundStyle, border: "1px solid"}} onClick={()=>{setSelectedDateKey(dateKey)}}>
                        <Box sx={{width: "100%", height: "100%"}}>
                            <p style={selectedStyle}>{" " + incrementDate.getDate()}</p>
                            <p >{" " + schName}</p>
                        </Box>
                    </td>
                );
            }
            tableRows.push(<tr>{rowEntries}</tr>);
        }

        return tableRows;
    }

    function todayButton() // bring month back to current month and select today's date
    {
        resetToToday();
    }
    function previousButton() // move the calendar UI to the previous month
    {
        setTableMonth((tableMonth + 11) % 12); // + 11 prevents months from going negative
    }
    function nextButton() // move the calendar UI to the next month
    {
        setTableMonth((tableMonth + 1) % 12)
    }

    // The editor for modifying the 'calendar' state based on the 'selectedDateKey'
    function displayEditor()
    {
        var scheduleType = "DEFAULT"; // whether it is a default schedule or a special schedule this day
        var schedule = null; // the special schedule for this day (if any)

        if (calendar[selectedDateKey]) // if there is a special schedule on this day
        {
            if (calendar[selectedDateKey].repeating) // is it a repeating one
            {
                scheduleType = "Special: Repeating";
            }
            else // or a one time event
            {
                scheduleType = "Special: One-Time";
            }
        }

        // What actualy gets displayed
        return (
            <Box sx={{display: "flex"}}>
                <Box sx={{width: "50%"}}>
                    <p>Schedule Type: </p>
                    <Select variant="filled" value={scheduleType} onChange={(e) => {updateScheduleType(e); submitCalendar();}} sx={{width: 250}}>
                        <MenuItem value={"DEFAULT"}>DEFAULT</MenuItem>
                        <MenuItem value={"Special: One-Time"}>Special: One-Time</MenuItem>
                        <MenuItem value={"Special: Repeating"}>Special: Repeating</MenuItem>
                    </Select>
                </Box>
                <Box sx={{width: "50%"}}>
                    {optionalScheduleSelect()}
                </Box>
            </Box>
        );

        // Called when the user wants to change the scheduleType for the selected date
        function updateScheduleType(e)
        {
            if (e.target.value !== scheduleType)
            {
                scheduleType = e.target.value;
            }
        }

        // If this date has a special schedule, allow the user to select the schedule
        function optionalScheduleSelect()
        {
            if (scheduleType !== "DEFAULT")
            {
                var defaultValue = null;
                if (calendar[selectedDateKey]) defaultValue = calendar[selectedDateKey].schedule;
                console.log(defaultValue);
                return (
                    <div>
                        <p>Schedule: </p>
                        <ScheduleDropdown schedules={schedules} nullSelectionName={"NO SCHEDULE"} defaultValue={defaultValue} callback={(res)=>{schedule = res; submitCalendar();}} />
                    </div>
                );
            }

            return;
        }

        // called whenever any of the displayEditor dropdowns are modified by the user
        function submitCalendar()
        {
            if (scheduleType === "DEFAULT") // delete any special schedule for the date
            {
                const copiedCalendar = {...calendar};
                delete copiedCalendar[selectedDateKey];
                setCalendar(copiedCalendar);
                updateServerCalendar(copiedCalendar);
            }
            else if (scheduleType === "Special: One-Time") // create a One-Time special schedule for the date
            {
                const copiedCalendar = {...calendar};
                copiedCalendar[selectedDateKey] = {schedule:schedule, repeating:false};
                setCalendar(copiedCalendar);
                updateServerCalendar(copiedCalendar);
            }
            else if (scheduleType === "Special: Repeating") // create a Reapeating special schedule for the date
            {
                const copiedCalendar = {...calendar};
                copiedCalendar[selectedDateKey] = {schedule:schedule, repeating:true};
                setCalendar(copiedCalendar);
                updateServerCalendar(copiedCalendar);
            }
            else {console.log("Invalid Schedule Type!")} // this shouldn't ever run if the code works correctly
        }
    }

    // TODO: <Link to = "/"> home link </Link>
    return(
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh", marginBottom: 3}}>
                <h1>Special Event Calendar</h1>
            </Box>
            <Paper elevation={7} sx={{padding:2.5, width: "70%"}}>
                <Box sx={{display: "flex", marginBottom: 1}}>
                    <Box sx={{display: "flex", width: "35%"}}>
                        <Button variant="outlined" size="medium" onClick={todayButton} sx={{marginRight: 1}}>Today</Button>
                        <ButtonGroup variant="outlined" size="medium" sx={{marginRight: 1}}>
                            <Button onClick={previousButton}>Previous Month</Button>
                            <Button onClick={nextButton}>Next Month</Button>
                        </ButtonGroup>
                    </Box>
                    <Box sx={{display: "flex", width: "30%", justifyContent: "center"}}>
                        <h1>{numToMonth(tableMonth)}</h1>
                    </Box>
                    <Box sx={{display: "flex", width: "35%", minHeight: "100%", alignItems: "center", justifyContent: "center"}}>
                        <h3>Date Selected: {getSelectedDateString()}</h3>
                    </Box>
                </Box>
                <Box sx={{aspectRatio: 2/1, marginBottom: 2}}>
                    <table style={{tableLayout: "fixed", borderCollapse: "collapse", width: "100%", height: "100%"}}>
                        <thead>
                            <tr>
                                <th>Sunday</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayMonth(tableMonth)}
                        </tbody>
                    </table>
                </Box>
                
                <Box>
                    {displayEditor()}
                </Box>
            </Paper>
        </Box>
    );
}

export default CalendarPage;