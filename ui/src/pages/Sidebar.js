import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="Sidebar">
            <Link to="/week"><button className="button">Configure Week</button></Link>
            <Link to="/schedules"><button className="button">Configure Schedules</button></Link>
            <Link to="/"><button className="button">Log Out</button></Link>
        </div>
    );
}

export default Sidebar;