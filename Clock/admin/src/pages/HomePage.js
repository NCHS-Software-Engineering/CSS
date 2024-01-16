import React, { useState, useEffect, useRef} from "react";
import { Link } from 'react-router-dom';


function HomePage()
{
    return(
        <div>
            <h1>HomePage</h1>

            <div className="Links">
                <Link to = "/calendar"> calendar link </Link>
                <br/>
                <Link to = "/defaultWeek"> default week link </Link>
                <br/>
                <Link to = "/schedules"> schedules link </Link>
                <br/>
                <Link to = "/login"> login link </Link>
            </div>
        </div>
    );
}

export default HomePage;