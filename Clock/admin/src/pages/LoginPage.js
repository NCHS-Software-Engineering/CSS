import React from "react";
import { Link } from 'react-router-dom';


// TODO: all of login and authentication... (use google SSO?)
function LoginPage()
{
    return(
        <div>
            <Link to = "/"> home link </Link>

            <h1>LoginPage</h1>
            <p>imagine a google login...</p>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <p>NOW SCRAM!</p>
        </div>
    );
}

export default LoginPage;