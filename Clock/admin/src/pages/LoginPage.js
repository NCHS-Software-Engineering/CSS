import "../styles/App.css";

import { useGoogleLogin } from '@react-oauth/google';
import {Box, Button} from '@mui/material/';
import logoLight from '../images/logoLight.png';
import logoDark from '../images/logoDark.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";

function LoginPage() {
  const [loggedin, setLoggedin] = useState(false);

  const login = useGoogleLogin({
        onSuccess: (codeResponse) => {axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {})
          .then((res) => {
              //sessionStorage.setItem('token', res.data.id);
              document.cookie = "token=" + res.data.id + "; SameSite=Strict";
              setLoggedin(true);
            })
          .catch((err) => console.log(err));},
        onError: (error) => console.log('Login Failed:', error)
    });
  
  return (
      <div className="App">
        <Box sx={{height: '100vh', display: "flex", flexDirection:"column", justifyContent: 'center', alignItems: 'center'}}>
          <Box sx={{height: "50%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <img src={logoDark} style={{aspectRatio: 1}} height="100%" alt="da logo"></img>
          </Box>
          <p>Classroom Scheduling System Admin Portal</p>
          <Box sx={{height: "50%", width: "100%", display: "flex", justifyContent: "center"}}>
            {loggedin ? <Navigate to="/home" /> : <Button sx={{height: "30%", aspectRatio: 2/1}} variant="contained" color="primary" onClick={login}>Login</Button>}
          </Box>
        </Box>
      </div>
    );
  }
  
  export default LoginPage;