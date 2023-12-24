import './App.css';
import React, { useState, useEffect } from "react";

function App()
{
  const [display, setDisplay] = useState("Prepairing Connection");


  const portNum = 8000; // Change this number in order to change which port the server is listening on
  var serverUrl = 'ws://localhost:' + portNum; // may need to change this if we host the server on a different url

  const clientSocket = new WebSocket(serverUrl); // represents the client socket


  clientSocket.addEventListener('open', (event) => onConnect(event)); // runs when a connection is established
  clientSocket.addEventListener('error', (event) => onError(event)); // runs if the connection failse

  function onConnect(event)
  {
    setDisplay("connected to server");
  }
  function onError(event) // retry the connection
  {
    setDisplay(display + ".");
    setTimeout(() => {serverUrl = 'ws://localhost:' + portNum;}, 5000);

    console.log("Attempting to connect");
  }


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
