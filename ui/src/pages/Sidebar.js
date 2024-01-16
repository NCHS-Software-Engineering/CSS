import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="Sidebar">
            <Link to="/week"><button className="button button-sidebar" width="400">Configure Week</button></Link>
            <Link to="/schedules"><button className="button button-sidebar">Configure Schedules</button></Link>
            <Link to="/"><button className="button button-sidebar">Log Out</button></Link>
        </div>
    );
}

export default Sidebar;