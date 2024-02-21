import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    background: {
      main: '#121216',
      contrast: '#FFFFFF',
    },
    primary: {
      light: '#a3a9c1',
      main: '#4F5686',
      dark: '#393c65',
      contrast: '#FFFFFF',
    },
    secondary: {
      light: '#fadce3',
      main: '#F0A8B9',
      dark: '#c10042',
      contrast: '#000000'
    },
  },
});
