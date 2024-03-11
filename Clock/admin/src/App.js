import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import PreviewPage from './pages/PreviewPage';
import CalendarPage from './pages/CalendarPage';
import DefaultWeekPage from './pages/DefaultWeekPage';
import LoginPage from './pages/LoginPage';
import SchedulesPage from './pages/SchedulesPage';
import Box from '@mui/material/Box';

import "./styles/App.css";


function App() {
  // the routing to the various pages
  return (
    <Box className='Box'>
      <BrowserRouter>
        <Routes> {/* The paths to all of the pages are contained here */}
          
          <Route path="/" element = {<LoginPage />} /> {/* Take user to home page by default */}

          <Route path="/preview" element = {<Box display="flex"><Sidebar /><PreviewPage /></Box>} />
          <Route path="/calendar" element = {<Box display="flex"><Sidebar /><CalendarPage /></Box>} />
          <Route path="/defaultWeek" element = {<Box display="flex"><Sidebar /><DefaultWeekPage /></Box>} />
          <Route path="/schedules" element = {<Box display="flex"><Sidebar /><SchedulesPage /></Box>} />

          <Route path = "*" element = {<h1>PAGE NOT FOUND!!!</h1>} /> {/* In case the page is not found */}

        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
