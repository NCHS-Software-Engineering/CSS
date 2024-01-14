import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import WeekConfig from './WeekConfig';
import ScheduleConfig from './ScheduleConfig';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                </Routes>
                <Routes>
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/week" element={<WeekConfig />} />
                    <Route exact path="/schedules" element={<ScheduleConfig />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;