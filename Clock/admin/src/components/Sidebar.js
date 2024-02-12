import { Link } from 'react-router-dom';
import "../styles/App.css";

function Sidebar() {
    return (
        <div className="Sidebar">
            <Link to="/preview"><button className="button button-sidebar" width="400">Preview</button></Link>
            <Link to="/layout"><button className="button button-sidebar">Layout</button></Link>
            <Link to="/calendar"><button className="button button-sidebar">Calendar</button></Link>
            <Link to="/defaultWeek"><button className="button button-sidebar">Default Week</button></Link>
            <Link to="/schedules"><button className="button button-sidebar">Schedules</button></Link>
            
            <Link to="/"><button className="button button-sidebar">Log Out</button></Link>
        </div>
    );
}

export default Sidebar;