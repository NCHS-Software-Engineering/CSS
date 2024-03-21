import React, { useState, useEffect, useRef} from "react";


function Timekeeper(props = null) //  props.schedule, props.countdownCallback, props.periodNameCallback
{
  const schedule = useRef([]); // the schedule that the coundown is based on (it is an array of objects)
  const day = useRef(0) // the day of the week
  const period = useRef(0) // the index of the schedule array
  const periodName = useRef(null); // e.g. "P1", "P2", "SOAR", "P3", etc.
  const passingPeriod = useRef(false); // whether this is a passing period 
  const schoolOut = useRef(true); // true when the school day is over or there is no school
  const [countdown, setCountdown] = useState(null); // countdown until the end of the current period (displayed)


  // deal with schedule update
  useEffect(() =>
  {
    schedule.current = props.schedule;
    scheduleInit();
  }, [props]);

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
        setCountdown(null);
        periodName.current = null;
      }
      else // display the countdown
      {
        var currentTime = 0; // the current time on this machine (in ms)
        var finishTime = 0; // the time at the end of the period (in ms)
        
        currentTime += tempDate.getHours() * 60 * 60 * 1000; // convert hours to miliseconds
        currentTime += tempDate.getMinutes() * 60 * 1000; // convert minutes to miliseconds
        currentTime += tempDate.getSeconds() * 1000; // convert seconds to miliseconds

        var temp; // parse out data for finish time
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
        if (deltaTime <= 0) // period ends
        {
          if (period.current + 1 >= schedule.current.length && passingPeriod.current === false) // no period's left in list
          {
            schoolOut.current = true; // school day is over
          }
          else // transition to next period/passing-period
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
        else // countdown === deltaTime
        {
          setCountdown(deltaTime);
        }
      }  
    }, 100); // every ~0.1 sec

    return () => clearInterval(interval);
  }, []);



  // ---------- callback functions ----------

  useEffect (() => {
    if (props) props.countdownCallback(countdown);
  }, [countdown]);

  useEffect (() => {
    if (props) props.periodNameCallback(periodName.current);
  }, [periodName.current]);


  // ---------- return ----------
  return (<div style={{position:"absolute", width:0, height:0}}></div>); // should not actualy be seen or interacted with
}

export default Timekeeper;