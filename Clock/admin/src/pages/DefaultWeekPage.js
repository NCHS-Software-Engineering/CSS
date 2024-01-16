import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import ScheduleDropdown from "../components/ScheduleDropdown";


// TODO: will need logic to turn all of the inputed data into a new 'defaultWeek' JSON file
// TODO: will need to actualy update the server
// TODO: send the user back to the home page when the defaultWeek is updated? (some form of user feedback)
function DefaultWeekPage() 
{
    const [defaultWeek, setDefaultWeek] = useState({});
  
    const baseURL = "http://localhost:8500/"; // This will likly need to be changed for a production build



    // TODO: and authorization header can be used to make sure that this user has admin credentials
    function updateServerDefaultWeek(info) // Sends the schedules to the server 
    {
        fetch(`${baseURL}defaultWeek`,
        {
            method:"PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });
    }



    useEffect(() => {
        fetch(`${baseURL}defaultWeek`)
        .then((res) => res.json())
        .then((data) => {setDefaultWeek(data);}
        );
    }, []);
  

    function setDay(day, schedule)
    {
        const copiedDefaultWeek = {...defaultWeek};
        copiedDefaultWeek[day] = schedule;
        setDefaultWeek(copiedDefaultWeek);
    }

    function submitDefaultWeek()
    {
        updateServerDefaultWeek(defaultWeek);
        window.alert("Default Week Updated");
    }


    return(
        <div>
            <Link to = "/"> home link </Link>

            <h1>Default-Week Page</h1>

            <table>
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
                            <ScheduleDropdown defaultValue={defaultWeek[1]} callback={(res)=>{setDay(1, res)}} />
                        </td>
                    </tr>
                    <tr>
                        <td>Tuesday</td>
                        <td>
                            <ScheduleDropdown defaultValue={defaultWeek[2]} callback={(res)=>{setDay(2, res)}} />
                        </td>
                    </tr>
                    <tr>
                        <td>Wednesday</td>
                        <td>
                            <ScheduleDropdown defaultValue={defaultWeek[3]} callback={(res)=>{setDay(3, res)}} />
                        </td>
                    </tr>
                    <tr>
                        <td>Thursday</td>
                        <td>
                            <ScheduleDropdown defaultValue={defaultWeek[4]} callback={(res)=>{setDay(4, res)}} />
                        </td>
                    </tr>
                    <tr>
                        <td>Friday</td>
                        <td>
                            <ScheduleDropdown defaultValue={defaultWeek[5]} callback={(res)=>{setDay(5, res)}} />
                        </td>
                    </tr>
                    <tr>
                        <td>Saturday</td>
                        <td>
                            <ScheduleDropdown defaultValue={defaultWeek[6]} callback={(res)=>{setDay(6, res)}} />
                        </td>
                    </tr>
                    <tr>
                        <td>Sunday</td>
                        <td>
                            <ScheduleDropdown defaultValue={defaultWeek[0]} callback={(res)=>{setDay(0, res)}} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <button onClick={submitDefaultWeek}>Submit form</button>
        </div>
    );
}

export default DefaultWeekPage;