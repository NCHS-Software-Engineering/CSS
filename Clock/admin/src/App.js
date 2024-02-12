import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import PreviewPage from './pages/PreviewPage';
import CalendarPage from './pages/CalendarPage';
import DefaultWeekPage from './pages/DefaultWeekPage';
import LoginPage from './pages/LoginPage';
import SchedulesPage from './pages/SchedulesPage';

import "./styles/App.css";


function App() {
  // the routing to the various pages
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes> {/* The paths to all of the pages are contained here */}
          
          <Route path="/" element = {<LoginPage />} /> {/* Take user to home page by default */}

          <Route path="/preview" element = {<><Sidebar /><PreviewPage /></>} />
          <Route path="/calendar" element = {<><Sidebar /><CalendarPage /></>} />
          <Route path="/defaultWeek" element = {<><Sidebar /><DefaultWeekPage /></>} />
          <Route path="/schedules" element = {<><Sidebar /><SchedulesPage /></>} />

          <Route path = "*" element = {<h1>PAGE NOT FOUND!!!</h1>} /> {/* In case the page is not found */}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
