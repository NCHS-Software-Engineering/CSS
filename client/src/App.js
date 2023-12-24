import './App.css';
import React, { useState, useEffect, useRef} from "react";

function App()
{
  const [display, setDisplay] = useState("Prepairing Connection");

  // TODO: possible error where the client stops attempting to connect to server if initial few attempts fail?!

  const portNum = 8000; // Change this number in order to change which port the server is listening on
  const serverUrl = 'ws://localhost:' + portNum; // may need to change this if we host the server on a different url

  const clientSocketRef = useRef(null); // represents the reference to the client socket

  // useEffect is called on startup ONLY
  useEffect (() =>
  {
    clientSocketRef.current = new WebSocket(serverUrl); // clientSocketRef.current represents the client socket

    clientSocketRef.current.addEventListener('open', (event) => onConnect(event)); // runs when a connection is established
    clientSocketRef.current.addEventListener('error', (event) => onError(event)); // runs if the connection failse

    function onConnect(event)
    {
      console.log("connected"); // DEBUG

      setDisplay("Connected to Server");
    }
    function onError(event) // retry the connection
    {
      setDisplay("Can Not Connect to Server!");

      setTimeout(() => 
      {
        if (clientSocketRef.current.readyState !== WebSocket.OPEN) // only retry if the current connection isn't open
        {
          clientSocketRef.current = new WebSocket(serverUrl);
        }
      }, 5000); // every 5 seconds
    }

    return () => {clientSocketRef.current.close();}; // this is a cleanup function. Basicaly, it will close the WebSocket connection when you close the tab or navigate off of the page
  }, [serverUrl]); // end of useEffect


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
