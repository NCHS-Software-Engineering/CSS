import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { darkTheme } from "./styles/darkTheme";
import getLPTheme from "./styles/LPTheme";


const theme = createTheme(getLPTheme('dark'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <Typography variant="body2">
      <App />
    </Typography>
    </ThemeProvider>
  </React.StrictMode>
);
