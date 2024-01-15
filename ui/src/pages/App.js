import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import WeekConfig from './WeekConfig';
import ScheduleConfig from './ScheduleConfig';
import Sidebar from './Sidebar';
import React, { useState } from 'react';

function App() {
    const [loginStatus, setLoginStatus] = useState(false);
    
    return (
        

        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/week" element={(<><Sidebar /><WeekConfig /></>)} />
                    <Route exact path="/schedules" element={<><Sidebar /><ScheduleConfig /></>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;