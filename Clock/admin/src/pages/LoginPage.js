import "../styles/App.css";
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Button from '@mui/material/Button';
import logo from '../images/logo.png';
import { useState, useEffect } from 'react';
import axios from 'axios';

function LoginPage() {
  const [ user, setUser ] = useState([]);

  /**/
  useEffect(() => {
    if (user) {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          })
        .then((res) => {
              console.log("hi");})
        .catch((err) => console.log(err));
    }},
    [ user ]
  );

  const login = useGoogleLogin({
        onSuccess: (codeResponse) => {setUser(codeResponse);
                console.log('Login Success:', codeResponse)},
        onError: (error) => console.log('Login Failed:', error)
    });
  
  return (
      <div className="App">
        <header className="App-header">
          <img className="logo" src={logo} alt="logo" />
          <h1>Login</h1>
        </header>
        <body className="App-menu">
          <div>
            <Button variant="contained" color="primary" onClick={login}>Login with Google</Button>
          </div>
        </body>
      </div>
    );
    /**/

    return "do later";
  }
  
  export default LoginPage;