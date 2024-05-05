import React, { useState, useEffect, useRef} from "react";


function Timekeeper(props = null) //  props.schedule, props.countdownCallback, props.periodNameCallback
{
  const [schedule, setSchedule] = useState([]); // the schedule that the coundown is based on (it is an array of objects)
  const [day, setDay] = useState(0) // the day of the week
  const [period, setPeriod] = useState(0) // the index of the schedule array
  const [periodName, setPeriodName] = useState(null); // e.g. "P1", "P2", "SOAR", "P3", etc.
  const [passingPeriod, setPassingPeriod] = useState(false); // whether this is a passing period 
  const [schoolOut, setSchoolOut] = useState(true); // true when the school day is over or there is no school
  const [countdown, setCountdown] = useState(null); // countdown until the end of the current period (displayed)


  // deal with prop update
  useEffect(() =>
  {
    setSchedule(props.schedule);
  }, [props]);
  useEffect(() =>
  {
    scheduleInit();
  }, [schedule]);

  // runs every time a new schedule is received
  function scheduleInit() 
  {
    const tempDate = new Date();
    setDay(tempDate.getDay());
    
    if (schedule.length === 0) // if the schedule is empty
    {
      setSchoolOut(true);
      return;
    }
    
    // determine the current period and wether it is a passing period
    for (let i = 0; i < schedule.length; i++)
    {
      const startTime = schedule[i].start.replace(":",""); // e.g. "07:25" => "0725"
      const endTime = schedule[i].end.replace(":",""); // e.g. "13:45" => "1345"

      if ((tempDate.getHours() * 100) + tempDate.getMinutes() < parseInt(endTime))
      {
        setPeriod(i);

        if (tempDate.getHours() < parseInt(startTime)) // passing period
        {
          setPassingPeriod(true);
          if (i === 0)
          {
            setPeriodName("Before School");
          }
          else
          {
            setPeriodName("Passing Period");
          }
        }
        else // regular period
        {
          setPassingPeriod(false);
          setPeriodName(schedule[i].name);
        }

        setSchoolOut(false);
        return;
      }
    }
    setSchoolOut(true); // no periods left, so school must be over
  }

  // rerender the countdown
  useEffect(() => 
  {
    const interval =  setInterval(() => 
    {
      const tempDate = new Date();
      if (tempDate.getDay() !== day) scheduleInit(); // reinitialize the schedule if it is a new day

      if (schoolOut === true) // just display the time
      {
        setCountdown(null);
        setPeriodName(null);
      }
      else // display the countdown
      {
        var currentTime = 0; // the current time on this machine (in ms)
        var finishTime = 0; // the time at the end of the period (in ms)
        
        currentTime += tempDate.getHours() * 60 * 60 * 1000; // convert hours to miliseconds
        currentTime += tempDate.getMinutes() * 60 * 1000; // convert minutes to miliseconds
        currentTime += tempDate.getSeconds() * 1000; // convert seconds to miliseconds

        var temp; // parse out data for finish time
        if (passingPeriod === true)
        {
          temp = schedule[period].start.split(":");
        }
        else
        {
          temp = schedule[period].end.split(":");
        }
        
        finishTime += parseInt(temp[0]) * 60 * 60 * 1000; // convert hours to miliseconds
        finishTime += parseInt(temp[1]) * 60 * 1000; // convert minutes to miliseconds

        const deltaTime = finishTime - currentTime;
        if (deltaTime <= 0) // period ends
        {
          if (period + 1 >= schedule.length && passingPeriod === false) // no period's left in list
          {
            setSchoolOut(true); // school day is over
          }
          else // transition to next period/passing-period
          {
            if (passingPeriod === false)
            {
              setPeriod(period + 1);
              setPeriodName("Passing Period");
            }
            else
            {
              setPeriodName(schedule[period].name);
            }
            setPassingPeriod(!passingPeriod);
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
  }, [schedule, period, day, schoolOut, periodName, passingPeriod]);



  // ---------- callback functions ----------

  useEffect (() => {
    props.countdownCallback(countdown);
  }, [countdown]);

  useEffect (() => {
    props.periodNameCallback(periodName);
  }, [periodName]);


  // ---------- return ----------
  return (<div style={{position:"absolute", width:0, height:0}}></div>); // should not actualy be seen or interacted with
}

export default Timekeeper;