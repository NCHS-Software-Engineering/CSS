import './App.css';
import React, { useState, useEffect, useRef} from "react";

function App()
{
  const schedule = useRef([]); // the schedule that the coundown is based on (it is an array of objects)
  const period = useRef(0) // the index of the schedule array
  const periodName = useRef("");
  const passingPeriod = useRef(false); // wether this is a passing period 
  const schoolOut = useRef(true); // true when the school day is over or there is no school
  const [countdown, setCountdown] = useState(); // countdown until the end of the current period (displayed)


  const portNum = 8000; // Change this number in order to change which port the server is listening on
  const serverUrl = 'ws://localhost:' + portNum; // may need to change this if we host the server on a different url
  // Deal with WebSocket stuff. should run only once at the start
  useEffect(() =>
  {
    const ws = new WebSocket(serverUrl); // represents the client socket

    ws.addEventListener("message", e => 
    {
      schedule.current = JSON.parse(e.data);
      scheduleInit();
    });
  }, []);

  // runs every time a new schedule is received
  function scheduleInit() 
  {
    if (schedule.current.length === 0) // if the schedule is empty
    {
      schoolOut.current = true;
      return;
    }
    
    const tempTime = new Date();
    // determin the current period and wether it is a passing period
    for (let i = 0; i < schedule.current.length; i++)
    {
      const startTime = schedule.current[i].start.replace(":",""); // e.g. "07:25" => "0725"
      const endTime = schedule.current[i].end.replace(":",""); // e.g. "13:45" => "1345"

      if ((tempTime.getHours() * 100) + tempTime.getMinutes() < parseInt(endTime))
      {
        period.current = i;

        if (tempTime.getHours() < parseInt(startTime)) // passing period
        {
          passingPeriod.current = true;
          periodName.current = "Before School";
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
      if (schoolOut.current === true) // just display the time
      {
        setCountdown((new Date()).getTime());
      }
      else // display the countdown
      {
        const currentTime = new Date(); // the current time at function execution
        const finishTime = new Date(currentTime.getTime());
        var temp;

        if (passingPeriod.current === true)
        {
          temp = schedule.current[period.current].start.split(":");
        }
        else
        {
          temp = schedule.current[period.current].end.split(":");
        }

        // custom Date object with the time being the end of the current period
        finishTime.setHours(parseInt(temp[0]));
        finishTime.setMinutes(parseInt(temp[1]));
        finishTime.setSeconds(0);

        const deltaTime = new Date(finishTime.getTime() - currentTime.getTime());
        if (deltaTime.getTime() <= 0)
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
          var tempDisplay = "";
          if (deltaTime.getHours() > 0) tempDisplay += deltaTime.getHours().toString().padStart(2, "0") + ":";
          if (deltaTime.getHours() > 0 || deltaTime.getMinutes() > 0)tempDisplay += deltaTime.getMinutes().toString().padStart(2, "0") + ":";
          tempDisplay += deltaTime.getSeconds().toString().padStart(2, "0");

          setCountdown(tempDisplay);
        }
      }  
    }, 1000); // every ~1 sec
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