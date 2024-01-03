import './App.css';
import React, { useState, useEffect, useRef} from "react";

function App()
{
  const [display, setDisplay] = useState("Prepairing Connection"); // a test display showing the # of server connections
  const [countdown, setCountdown] = useState(0); // countdown until the end of the current period


  const portNum = 8000; // Change this number in order to change which port the server is listening on
  const serverUrl = 'ws://localhost:' + portNum; // may need to change this if we host the server on a different url
  // Deal with WebSocket stuff. should run only once at the start
  useEffect(() =>
  {
    const ws = new WebSocket(serverUrl); // represents the client socket

    ws.addEventListener("open", () =>
    {
      console.log("Connected")
      setDisplay("Connected");
    });

    ws.addEventListener("message", e => 
    {
      console.log(e.data);
      setDisplay(e.data);
    });
  }, []);

  // rerender the countdown
  useEffect(() => 
  {
    const interval =  setInterval(() => {
      setCountdown((new Date()).getTime()); // update the countdown
    }, 950); // every ~0.95 sec
  }, []);



  // This is what actualy gets displayed
  return (
    <div className="App">
      <header className="App-header">
        <h1>Da Clock app!!!</h1> 
        <p>{display}</p>
        <p>date: {countdown}</p>
      </header>
    </div>
  );
}

export default App;
