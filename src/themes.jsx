import { createTheme } from '@mui/material/styles';

export const DARK_THEME = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#111217',
    },
    bg: '#15171B',
    grid: '#434548',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'white',
          color: '#526a82',
          border: '1px solid #526a82',
        },
      },
    },
  },
})

export const LIGHT_THEME = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#526a82',
    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      paper: '#FFFFFF',
    },
    bg: '#EDF2F8',
    grid: '#CCCCCC'
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'white',
          color: '#526a82',
          border: '1px solid #526a82',
        },
      },
    },
  },
})
