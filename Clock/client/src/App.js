import './App.css';
import React, { useState, useEffect, useRef} from "react";

function App()
{
  const schedule = useRef([]); // the schedule that the coundown is based on (it is an array of objects)
  const day = useRef(0) // the day of the week
  const period = useRef(0) // the index of the schedule array
  const periodName = useRef("");
  const passingPeriod = useRef(false); // wether this is a passing period 
  const schoolOut = useRef(true); // true when the school day is over or there is no school
  const [countdown, setCountdown] = useState(); // countdown until the end of the current period (displayed)


  const portNum = 8000; // Change this number in order to change which port the server is listening on
  const serverUrl = 'ws://localhost:' + portNum; // may need to change this if we host the server on a different url
  
  // Deal with WebSocket stuff. should run only once at the start ()
  useEffect(() =>
  {
    console.log("hi");

    const ws = new WebSocket(serverUrl); // represents the client socket

    ws.addEventListener("message", e => 
    {
      schedule.current = JSON.parse(e.data);
      scheduleInit();

      return () => {ws.close();};
    });
  }, [serverUrl]);

  // runs every time a new schedule is received
  function scheduleInit() 
  {
    const tempDate = new Date();
    day.current = tempDate.getDay();
    
    if (schedule.current.length === 0) // if the schedule is empty
    {
      schoolOut.current = true;
      return;
    }
    
    // determin the current period and wether it is a passing period
    for (let i = 0; i < schedule.current.length; i++)
    {
      const startTime = schedule.current[i].start.replace(":",""); // e.g. "07:25" => "0725"
      const endTime = schedule.current[i].end.replace(":",""); // e.g. "13:45" => "1345"

      if ((tempDate.getHours() * 100) + tempDate.getMinutes() < parseInt(endTime))
      {
        period.current = i;

        if (tempDate.getHours() < parseInt(startTime)) // passing period
        {
          passingPeriod.current = true;
          if (i === 0)
          {
            periodName.current = "Before School";
          }
          else
          {
            periodName.current = "Passing Period";
          }
        }
        else // regular period
        {
          passingPeriod.current = false;
          periodName.current = schedule.current[i].name;
        }

        schoolOut.current = false;
        return;
      }
    }
    schoolOut.current = true; // no periods left, so school must be over
  }

  // rerender the countdown
  useEffect(() => 
  {
    const interval =  setInterval(() => 
    {
      const tempDate = new Date();
      if (tempDate.getDay() !== day.current) scheduleInit(); // reinitialize the schedule if it is a new day
      
      if (schoolOut.current === true) // just display the time
      {
        setCountdown(tempDate.toTimeString());
      }
      else // display the countdown
      {
        var currentTime = 0; // the current time on this machine (in ms)
        var finishTime = 0; // the time at the end of the period (in ms)
        
        currentTime += tempDate.getHours() * 60 * 60 * 1000; // convert hours to miliseconds
        currentTime += tempDate.getMinutes() * 60 * 1000; // convert minutes to miliseconds
        currentTime += tempDate.getSeconds() * 1000; // convert seconds to miliseconds

        var temp;
        if (passingPeriod.current === true)
        {
          temp = schedule.current[period.current].start.split(":");
        }
        else
        {
          temp = schedule.current[period.current].end.split(":");
        }
        
        finishTime += parseInt(temp[0]) * 60 * 60 * 1000; // convert hours to miliseconds
        finishTime += parseInt(temp[1]) * 60 * 1000; // convert minutes to miliseconds

        const deltaTime = finishTime - currentTime;
        if (deltaTime <= 0)
        {
          if (period.current + 1 >= schedule.current.length && passingPeriod.current === false) // no period's left in list
          {
            schoolOut.current = true;
          }
          else
          {
            if (passingPeriod.current === false)
            {
              period.current = period.current + 1;
              periodName.current = "Passing Period";
            }
            else
            {
              periodName.current = schedule.current[period.current].name;
            }
            passingPeriod.current = !(passingPeriod.current);
          }

          setCountdown(0); // period over
        } // TODO: add an else-if statment that will check if there are 5 minutes left and have some sort of indicator turn on (e.g. numbers turn red)
        else
        {
          const hours = Math.floor(deltaTime / (60 * 60 * 1000));
          const minutes = Math.floor(deltaTime / (60 * 1000));
          const seconds = Math.floor(deltaTime / (1000));

          var tempDisplay = "";
          if (hours > 0) tempDisplay += hours.toString().padStart(2, "0") + ":"; // display hours if 1 hour or more is left
          if (minutes > 0) tempDisplay += (minutes % 60).toString().padStart(2, "0") + ":"; // display minutes if 1 minute or more is left
          tempDisplay += (seconds % 60).toString().padStart(2, "0"); // ad the seconds display

          setCountdown(tempDisplay);
        }
      }  
    }, 1000); // every ~1 sec

    return () => clearInterval(interval);
  }, []);



  // This is what actualy gets displayed
  if (schoolOut.current === false)
  {
    return (
      <div className="App">
        <header className="App-header">
          <h1>{periodName.current}</h1> 
          <p>{countdown}</p>
        </header>
      </div>
    );
  }
  else
  {
    return (
      <div className="App">
        <header className="App-header">
          <h1>No School</h1> 
          <p>{countdown}</p>
        </header>
      </div>
    );
  }
}

export default App;