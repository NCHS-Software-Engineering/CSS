import './App.css';
import React, { useState, useEffect, useRef} from "react";

function App()
{
  const [display, setDisplay] = useState("Prepairing Connection"); // the main display of the site

  const portNum = 8000; // Change this number in order to change which port the server is listening on
  const serverUrl = 'ws://localhost:' + portNum; // may need to change this if we host the server on a different url
  

  // should run only once at the start
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


  return (
    <div className="App">
      <header className="App-header">
        <h1>Da Clock app!!!</h1> 
        <p>This is the client speaking</p>
        <p>{display}</p>
      </header>
    </div>
  );
}

export default App;
