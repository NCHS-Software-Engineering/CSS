import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import ScheduleDropdown from "../components/ScheduleDropdown";
import PeriodEditor from "../components/PeriodEditor";


// TODO: will need logic to turn all of the inputed data into a new 'schedules' JSON file
// TODO: will need to actualy update the server
// TODO: send the user back to the home page when the defaultWeek is updated? (some form of user feedback)
function SchedulesPage()
{
    const [schedules, setSchedules] = useState({});
    const [selection, setSelection] = useState(null);

    const [tempScheduleName, setTempScheduleName] = useState("");
    const [tempSchedule, setTempSchedule] = useState([]);

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




    useEffect(() => {
        fetch(`${baseURL}schedules`)
        .then((res) => res.json())
        .then((data) => {setSchedules(data);}
        );
    }, []);


    function changeSelection(newSelection)
    {
        setSelection(newSelection);
        setTempScheduleName(newSelection);

        if (newSelection === null)
        {
            setTempSchedule([]);
        }
        else
        {
            setTempSchedule(schedules[newSelection]);
        }
    }

    function changeScheduleName(e)
    {
        setTempScheduleName(e.target.value);
    }

    function displayEditor()
    {
        const periods = tempSchedule;

        const displayArr = [];

        if (periods)
        {
            for (let i = 0; i < periods.length; i++)
            {
                const element = periods[i];

                displayArr.push(<PeriodEditor id={i} name={element.name} start={element.start} end={element.end} callback={periodEditUpdate} />);
            }
        }
        
        return displayArr;
    }

    function periodEditUpdate(res)
    {
        const index = res.id;
        delete res.id;

        const newTempSchedule = tempSchedule;
        newTempSchedule[index] = res;
        
        setTempSchedule(newTempSchedule);
    }

    function addPeriod()
    {
        const newTempSchedule = [...tempSchedule]; // create a shallow copy
        const p = {};
        p.name = "";
        p.start = newTempSchedule.length > 0 ? newTempSchedule[newTempSchedule.length - 1].start : "00:00";
        p.end = p.start;

        newTempSchedule.push(p);
        
        setTempSchedule(newTempSchedule);
    }
    function deletePeriod()
    {
        const newTempSchedule = [...tempSchedule];
        
        if (newTempSchedule.length > 0) newTempSchedule.pop();

        setTempSchedule(newTempSchedule);
    }

    function specialInput() // delete schedule or name schedule
    {
        if (selection === null) // field for nameing schedule
        {
            return <input id="ScheduleNameInput" type="text" placeholder="Schedule Name" onInput={changeScheduleName}></input>;
        }

        // button for deleteing schedule
        return(
            <button onClick={() => {
                if (window.confirm("Are you sure that you want to delete schedule \"" + selection + "\" ?"))
                {
                    const copiedSchedules = {...schedules};
                    delete copiedSchedules[selection];

                    setSchedules(copiedSchedules);
                    updateServerSchedules(copiedSchedules);
                    changeSelection(null);
                }
            }}>DELETE SCHEDULE</button>
        );
    }

    function submitSchedule()
    {
        // check schedule validity
        if (tempScheduleName === null || tempScheduleName === "" || tempScheduleName === "EMPTY")
        {
            window.alert("Invalid Schedule Name!");
            return;
        }

        if (selection === null && schedules[tempScheduleName])
        {
            window.alert("Invalid Schedule Name!\nThe Schedule \"" + tempScheduleName + "\" Already Exists!");
            return;
        }

        if (!tempSchedule || tempSchedule.length === 0)
        {
            window.alert("Input Periods!");
            return;
        }

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

        // update server
        if (selection === null)
        {
            const copiedSchedules = {...schedules};
            copiedSchedules[tempScheduleName] = tempSchedule;
            setSchedules(copiedSchedules);
            updateServerSchedules(copiedSchedules);
            changeSelection(null);

            window.alert("Added New Schedule");
        }
        else if (selection === tempScheduleName)
        {
            const copiedSchedules = {...schedules};
            copiedSchedules[tempScheduleName] = tempSchedule;
            setSchedules(copiedSchedules);
            updateServerSchedules(copiedSchedules);
            changeSelection(null);

            window.alert("Updated Schedule");
        }
    }


    return(
        <div>
            <Link to = "/"> home link </Link>

            <ScheduleDropdown callback = {changeSelection} />

            {specialInput()}

            <table>
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Start</th>
                        <th>End</th>
                    </tr>
                </thead>

                <tbody key={selection}>
                    {displayEditor()}
                </tbody>
            </table>

            <button onClick={addPeriod}>Add Period</button>
            <button onClick={deletePeriod}>Delete Period</button>
            <br/>
            <button onClick={submitSchedule}>Submit form</button>
        </div>
    );
}

export default SchedulesPage;