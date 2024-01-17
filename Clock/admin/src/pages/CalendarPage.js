import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import ScheduleDropdown from "../components/ScheduleDropdown";

// TODO: User feedback is important! (through CSS maybe?)
function CalendarPage()
{
    const [calendar, setCalendar] = useState({});

    const [tableMonth, setTableMonth] = useState(0);

    const [selectedDateKey, setSelectedDateKey] = useState(-1);


    const today = new Date(); // todays date / time info
    const baseURL = "http://localhost:8500/"; // This will likly need to be changed for a production build



    // TODO: and authorization header can be used to make sure that this user has admin credentials
    function updateServerCalendar(info) // Sends the calendar to the server 
    {
        fetch(`${baseURL}calendar`,
        {
            method:"PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });
    }



    useEffect(() =>
    {
        setTableMonth(today.getMonth());
        setSelectedDateKey((today.getMonth() * 100) + today.getDate());
    }, []);

    useEffect(() => {
        fetch(`${baseURL}calendar`)
        .then((res) => res.json())
        .then((data) => {setCalendar(data);}
        );
    }, []);


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

    function displayMonth(month)
    {
        const firstDay = new Date(today); firstDay.setDate(1); firstDay.setMonth(month); // the first day of this month
        const lastDay = new Date(firstDay); lastDay.setMonth(firstDay.getMonth() + 1); lastDay.setDate(0); // the last day of this month

        var firstDisplayed = new Date(firstDay.getTime());
        while (firstDisplayed.getDay() !== 0) firstDisplayed.setDate(firstDisplayed.getDate() - 1);
        var lastDisplayed = new Date(lastDay.getTime());
        while (lastDisplayed.getDay() !== 6) lastDisplayed.setDate(lastDisplayed.getDate() + 1);

        const tableRows = [];

        const incrementDate = new Date(firstDisplayed.getTime());
        while (lastDisplayed.getTime() - incrementDate.getTime() >= 0)
        {
            const rowEntries = [];
            for (let day = 0; day < 7; day++, incrementDate.setDate(incrementDate.getDate() + 1))
            {
                const dateKey = (incrementDate.getMonth() * 100) + incrementDate.getDate();

                var backgroundStyle = {background:"#ffffff"}; // shading in for user feedback
                var selectedStyle = {fontWeight:"normal"};
                var schName = "";

                if (calendar[dateKey])
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
                if (dateKey === selectedDateKey)
                {
                    selectedStyle = {fontWeight:"bold"};
                }
                
                if (calendar[dateKey])
                {
                    if (calendar[dateKey].schedule === null) schName = "EMPTY";
                    else schName = calendar[dateKey].schedule;
                }
                
                rowEntries.push(<td style={backgroundStyle} onClick={()=>{setSelectedDateKey(dateKey)}}><p style={selectedStyle}>{incrementDate.getDate()}</p><p>{schName}</p> </td>);

            }
            tableRows.push(<tr>{rowEntries}</tr>);
        }


        return tableRows;
    }

    function todayButton()
    {
        setTableMonth(today.getMonth());
    }
    function previousButton()
    {
        setTableMonth((tableMonth + 11) % 12); // + 11 prevents months from going negative
    }
    function nextButton()
    {
        setTableMonth((tableMonth + 1) % 12)
    }

    function displayEditor()
    {
        const dateString = numToMonth(Math.floor(selectedDateKey / 100)) + " " + (selectedDateKey % 100);
        var scheduleType = "DEFAULT";
        var schedule = null;

        if (calendar[selectedDateKey])
        {
            if (calendar[selectedDateKey].repeating)
            {
                scheduleType = "Special: Repeating";
            }
            else
            {
                scheduleType = "Special: One-Time";
            }
        }

        return (
            <div>
                <p>{dateString}</p>
                <select value={scheduleType} onChange={(e) => {updateScheduleType(e); submitCalendar();}}>
                    <option>DEFAULT</option>
                    <option>Special: One-Time</option>
                    <option>Special: Repeating</option>
                </select>
                {optionalScheduleSelect()}
            </div>
        );

        function updateScheduleType(e)
        {
            if (e.target.value !== scheduleType)
            {
                scheduleType = e.target.value;
            }
        }

        function optionalScheduleSelect()
        {
            if (scheduleType !== "DEFAULT")
            {
                var defaultValue = null;
                if (calendar[selectedDateKey]) defaultValue = calendar[selectedDateKey].schedule;
                console.log(defaultValue);
                return (
                <ScheduleDropdown defaultValue={defaultValue} callback={(res)=>{schedule = res; submitCalendar();}} />
                );
            }

            return;
        }

        function submitCalendar()
        {
            if (scheduleType === "DEFAULT")
            {
                const copiedCalendar = {...calendar};
                delete copiedCalendar[selectedDateKey];
                setCalendar(copiedCalendar);
                updateServerCalendar(copiedCalendar);
            }
            else if (scheduleType === "Special: One-Time")
            {
                const copiedCalendar = {...calendar};
                copiedCalendar[selectedDateKey] = {schedule:schedule, repeating:false};
                setCalendar(copiedCalendar);
                updateServerCalendar(copiedCalendar);
            }
            else if (scheduleType === "Special: Repeating")
            {
                const copiedCalendar = {...calendar};
                copiedCalendar[selectedDateKey] = {schedule:schedule, repeating:true};
                setCalendar(copiedCalendar);
                updateServerCalendar(copiedCalendar);
            }
            else {console.log("Invalid Schedule Type!")}
        }
    }

    return(
        <div>
            <Link to = "/"> home link </Link>

            <button onClick={todayButton}>Today</button>
            <button onClick={previousButton}>Previous Month</button>
            <button onClick={nextButton}>Next Month</button>
            <h1>Month: {numToMonth(tableMonth)}</h1>

            <table>
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

            {displayEditor()}
        </div>
    );
}

export default CalendarPage;