import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function Login() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Login</h1>
        </header>
        <header className="App-menu">
            <form id="login">
                <label className="col-25" for="username">Username:</label>
                <input className="col-75" type="text" id="username" name="username"></input><br />
                <br />
                <label className="col-25" for="passwd">Password:</label>
                <input className="col-75" type="text" id="passwd" name="passwd"></input><br />
            </form>
            <br></br>
            <a href="/week">
              <button className="button" type="submit" id="login" onClick="">Continue</button>
            </a>
        </header>
      </div>
    );
  }
  
  export default Login;