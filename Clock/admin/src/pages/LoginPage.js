import "../styles/App.css";
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Button from '@mui/material/Button';
import logo from '../images/logo.png';
import { useState, useEffect } from 'react';

const clientId='1708349956-dj7lh20571btinvcqm33260chgv94pae.apps.googleusercontent.com';

function LoginPage() {

  /*
  useEffect(() => {
    if (user) {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
          }})
        .then((res) => {
              setProfile(res.data);})
        .catch((err) => console.log(err));
    }},
    [ user ]
  );

  const handleSuccess = (res) => {
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
              clientId={clientId}
              onSuccess={handleSuccess}
              onError={handleError}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </body>
      </div>
    );
    */

    return "do later";
  }
  
  export default LoginPage;