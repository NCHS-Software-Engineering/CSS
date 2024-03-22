import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import PreviewPage from './pages/PreviewPage';
import LayoutPage from './pages/LayoutPage';
import CalendarPage from './pages/CalendarPage';
import DefaultWeekPage from './pages/DefaultWeekPage';
import LoginPage from './pages/LoginPage';
import SchedulesPage from './pages/SchedulesPage';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css'; 
import "./styles/App.css";

import { Box } from '@mui/material';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  // the routing to the svarious pages
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{minWidth: "100%", height: "100vh", paddingRight: 1}}>
        <BrowserRouter>
          <Box sx={{display: 'flex', minWidth: "100%", minHeight: "100%"}}>
            <Sidebar />
            <Box sx={{width:"100%"}}>
              <Routes> {/* The paths to all of the pages are contained here */}
                
                <Route path="/" element = {<LoginPage />} /> {/* Take user to home page by default */}

                <Route path="/preview" element = {<PreviewPage />} />
                <Route path="/layout" element = {<LayoutPage />} />
                <Route path="/calendar" element = {<CalendarPage />} />
                <Route path="/defaultWeek" element = {<DefaultWeekPage />} />
                <Route path="/schedules" element = {<SchedulesPage />} />

                <Route path = "*" element = {<h1>PAGE NOT FOUND!!!</h1>} /> {/* In case the page is not found */}

              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </Box>
      </ThemeProvider>
  );
}

export default App;