import './App.css';
import WeekConfig from './WeekConfig';
import ScheduleConfig from './ScheduleConfig';
import { BrowserRouter } from 'react-router-dom';

function Home() {
  
  function test1()
  {
    console.log("test1");
  }
  function test2()
  {
    console.log("test2");
  }
  function test3()
  {
    console.log("test3");
  }


  return (

    <div className="App">
        <div className="Sidebar">
          <a href="/week"><button className="button">Configure Week</button></a>
          <a href="/schedule"><button className="button">Configure Schedules</button></a>
        </div>
        <div className="Content">
          
        </div>

    
      {/*
      <header className="App-header">
        <div className="Sidebar">
          <a href="/home"><button>View Schedule</button>></a>
        </div>

        <h1>Home Page</h1>
        

        <div className="Nav-buttons">
          <button type="button" onClick={test1}>test Button1</button>
          <button type="button" onClick={test2}>test Button2</button>
          <button type="button" onClick={test3}>test Button3</button>
        </div>
        
        

      </header>
      */}

    </div>
  );
}

export default Home;
