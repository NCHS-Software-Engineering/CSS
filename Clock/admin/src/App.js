import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

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
import HomePage from './pages/HomePage';

import AuthorizedRoute from './AuthorizedRoute'
import store from './store'


const lightTheme = createTheme({
  spacing: 8,
  palette: {
    mode: 'light',
    primary: {
      main: '#195D88',
    },
  },
});

const darkTheme = createTheme({
  spacing: 8,
  palette: {
    mode: 'dark',
    primary: {
      main: '#63a4da',
    },
  },
});


function App() {
  const [mode, setMode] = useState("light");

  function changeMode()
  {
    setMode((mode === "light") ? "dark" : "light");
  }

  // the routing to the svarious pages
  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box sx={{minWidth: "100%", height: "100vh", paddingRight: 1}}>
        <BrowserRouter>
          <Box sx={{display: 'flex', minWidth: "100%", minHeight: "100%"}}>
            <Routes> {/* The paths for the sidebar */}  
              <Route path="/selection/*" element = {<Sidebar currentTheme={mode} switchTheme={() => changeMode()}/>} /> {/* display sidebar if a selection was made */}
            </Routes>
            <Box sx={{width:"100%"}}>
              <Routes> {/* The paths to all of the pages are contained here */}  
                <Route path="/" element = {<LoginPage currentTheme={mode}/>} /> {/* Take user to login page by default */}
                <Route path="/home" element = {<HomePage />} /> {/* Room selection page */}
              
                <Route path="/selection/preview" element = {<PreviewPage />} />
                <Route path="/selection/layout" element = {<LayoutPage />} />
                <Route path="/selection/calendar" element = {<CalendarPage />} />
                <Route path="/selection/defaultWeek" element = {<DefaultWeekPage />} />
                <Route path="/selection/schedules" element = {<SchedulesPage />} />

                <Route path = "*" element = {<h1>PAGE NOT FOUND!!!</h1>} /> {/* In case the page is not found */}
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </Box>
      <Box sx={{position:"fixed", bottom:0, right:0}}>
        <p>Michael Mihailov (2025), Eric Gu (2024), Nick Patel (2025), & Nicole Liang (2024)</p>
      </Box>
      </ThemeProvider>
  );
}

export default App;