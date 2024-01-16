import { BrowserRouter, Route, Routes } from 'react-router-dom';

import CalendarPage from './pages/CalendarPage';
import DefaultWeekPage from './pages/DefaultWeekPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SchedulesPage from './pages/SchedulesPage';


function App() {
  // the routing to the various pages
  return (
    <BrowserRouter>
      <Routes> {/* The paths to all of the pages are contained here */}
        
        <Route path="/" element = {<HomePage />} /> {/* Take user to home page by default */}

        <Route path="/calendar" element = {<CalendarPage />} />
        <Route path="/defaultWeek" element = {<DefaultWeekPage />} />
        <Route path="/login" element = {<LoginPage />} />
        <Route path="/schedules" element = {<SchedulesPage />} />

        <Route path = "*" element = {<h1>PAGE NOT FOUND!!!</h1>} /> {/* In case the page is not found */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
