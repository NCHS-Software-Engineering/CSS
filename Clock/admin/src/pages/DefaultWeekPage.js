import React, { useState, useEffect } from "react";

import ScheduleDropdown from "../components/ScheduleDropdown";

import { Box, Button, Paper } from "@mui/material";
import { useSearchParams } from 'react-router-dom';


function DefaultWeekPage() 
{
    const [searchParams] = useSearchParams();
    
    const [defaultWeek, setDefaultWeek] = useState({}); // the current default-week (initially recieved from the server)
    const [schedules, setSchedules] = useState({});
  
    const baseURL = "http://localhost:8500/"; // This will likely need to be changed for a production build


    // TODO: and authorization header can be used to make sure that this user has admin credentials
    function updateServerDefaultWeek(info) // Sends the schedules to the server 
    {
        fetch(`${baseURL}defaultWeek`,
        {
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({room:searchParams.get("room"), data:info, token:document.cookie.substring(document.cookie.indexOf("token=")+6, document.cookie.indexOf("token=")+27)})
        });
    }

    // gets defaultWeek JSON object from server
    useEffect(() => {
        fetch(`${baseURL}defaultWeek?room=`+searchParams.get("room"))
        .then((res) => res.json())
        .then((data) => {setDefaultWeek(data);}
        );
    }, []);

    // gets schedules JSON object from server
    useEffect(() => {
        fetch(`${baseURL}schedules?room=`+searchParams.get("room"))
        .then((res) => res.json())
        .then((data) => {setSchedules(data);}
        );
    }, []);

  
    // replaces the schedule of a certain day ([0, 1, 2, 3, 4, 5, 6] --> (Sunday, Monday, Tuesday, etc))
    function setDay(day, schedule)
    {
        const copiedDefaultWeek = {...defaultWeek};
        copiedDefaultWeek[day] = schedule;
        setDefaultWeek(copiedDefaultWeek);
    }
    // update the server and notify the user that the server has been updated
    function submitDefaultWeek()
    {
        updateServerDefaultWeek(defaultWeek);
        window.alert("Default Week Updated");
    }


    return(
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Box sx={{height: "10vh", textAlign: "center", lineHeight:"10vh", marginBottom: 3}}>
                <h1>Default Week</h1>
            </Box>

            <Paper elevation={7} sx={{marginBottom: 3, padding: 1}}>
                <table style={{borderSpacing: "8px"}}>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Schedule Name</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Monday</td>
                            <td>
                                <ScheduleDropdown schedules={schedules} nullSelectionName={"NO SCHEDULE"} defaultValue={defaultWeek[1]} callback={(res)=>{setDay(1, res)}} />
                            </td>
                        </tr>
                        <tr>
                            <td>Tuesday</td>
                            <td>
                                <ScheduleDropdown schedules={schedules} nullSelectionName={"NO SCHEDULE"} defaultValue={defaultWeek[2]} callback={(res)=>{setDay(2, res)}} />
                            </td>
                        </tr>
                        <tr>
                            <td>Wednesday</td>
                            <td>
                                <ScheduleDropdown schedules={schedules} nullSelectionName={"NO SCHEDULE"} defaultValue={defaultWeek[3]} callback={(res)=>{setDay(3, res)}} />
                            </td>
                        </tr>
                        <tr>
                            <td>Thursday</td>
                            <td>
                                <ScheduleDropdown schedules={schedules} nullSelectionName={"NO SCHEDULE"} defaultValue={defaultWeek[4]} callback={(res)=>{setDay(4, res)}} />
                            </td>
                        </tr>
                        <tr>
                            <td>Friday</td>
                            <td>
                                <ScheduleDropdown schedules={schedules} nullSelectionName={"NO SCHEDULE"} defaultValue={defaultWeek[5]} callback={(res)=>{setDay(5, res)}} />
                            </td>
                        </tr>
                        <tr>
                            <td>Saturday</td>
                            <td>
                                <ScheduleDropdown schedules={schedules} nullSelectionName={"NO SCHEDULE"} defaultValue={defaultWeek[6]} callback={(res)=>{setDay(6, res)}} />
                            </td>
                        </tr>
                        <tr>
                            <td>Sunday</td>
                            <td>
                                <ScheduleDropdown schedules={schedules} nullSelectionName={"NO SCHEDULE"} defaultValue={defaultWeek[0]} callback={(res)=>{setDay(0, res)}} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Paper>
            <Box>
                <Button variant="contained" size="large" onClick={submitDefaultWeek}>Save</Button>
            </Box>
        </Box>
    );
}

export default DefaultWeekPage;