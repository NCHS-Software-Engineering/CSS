import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import logo from '../logo.png';

function Login() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="logo" src={logo} alt="logo" />
          <h1>Login</h1>
        </header>
        <body className="App-menu">
            <form id="login">
                <label  for="username">Username: </label>
                <input  type="text" id="username" name="username"></input>
                <br /><br />
                <label for="passwd">Password: </label>
                <input type="text" id="passwd" name="passwd"></input>
                <br /><br />
            </form>
            <br /><br />
            <a href="/week">
              <button className="button" type="submit" id="login" onClick="">Continue</button>
            </a>
        </body>
      </div>
    );
  }
  
  export default Login;