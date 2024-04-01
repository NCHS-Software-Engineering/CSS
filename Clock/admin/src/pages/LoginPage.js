import "../styles/App.css";
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import Button from '@mui/material/Button';
import logo from '../images/logo.png';
import { useEffect } from 'react';
import { gapi } from 'gapi-script';

function LoginPage() {
  const handleSuccess = (res) => {
    /*
    const authCode = res.code;

    fetch('http://localhost:8500/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: authCode }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Login successful:', data);
    })
    .catch(error => {
      console.error('Login error:', error);
    });
    */

    console.log('Login successful:', res.profileObj);
  };

  const handleError = (res) => {
    console.error('Login failed:', res);
  };
  
  return (
      <div className="App">
        <header className="App-header">
          <img className="logo" src={logo} alt="logo" />
          <h1>Login</h1>
        </header>
        <body className="App-menu">
          <div>
          <GoogleLogin
            clientId="1708349956-dj7lh20571btinvcqm33260chgv94pae.apps.googleusercontent.com"
            onSuccess={handleSuccess}
            onError={handleError}
            cookiePolicy={'single_host_origin'}
          />
          </div>
        </body>
      </div>
    );
  }
  
  export default LoginPage;