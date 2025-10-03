
// Import packages
import { useState, useEffect, useMemo } from "react";
import { Paper, IconButton, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

// Local imports
import { LIGHT_THEME, DARK_THEME } from '../themes';
import WeatherChart from "./WeatherChart";
// import Map from "./Map";

// Theme options
const THEME = {
  light: 'light',
  dark: 'dark'
}

function Main() {
  /****************************************************************************
   * THEME HANDLER
   ***************************************************************************/
  // if no local storage yet, default to light mode
  const storage = (!!localStorage.theme) ? localStorage.theme : THEME.light;

  const [storageTheme, setStorageTheme] = useState(storage)
  const [selectedTheme, setSelectedTheme] = useState(storage)

  const theme = useMemo(() =>
    selectedTheme === THEME.dark ? DARK_THEME : LIGHT_THEME
  , [selectedTheme])

  useEffect(() => {
    localStorage.setItem('theme', selectedTheme)
    setStorageTheme(selectedTheme) 
  }, [theme, storageTheme, selectedTheme])
  
  const toggleTheme = () => setSelectedTheme(selectedTheme === THEME.dark ? THEME.light : THEME.dark);
  /***************************************************************************/

  const [location, setLocation] = useState([0,0]) // Longitude, Latitude

  return (
    <ThemeProvider theme={theme}>
      <Paper className='App'>
        <div style={{ textAlign: 'right', padding: '20px' }}>
          <IconButton onClick={toggleTheme} color='primary'>
            {(selectedTheme === THEME.dark) ? <LightModeIcon/> : <DarkModeIcon/>}
          </IconButton>
        </div>
        <Typography variant='h3' align='center' color='primary'>
          <b> Seasonal Seasonality </b>
        </Typography>
        <Typography variant='h6' align='center' color='text.secondary'>
          Get year over year weather trends for the area selected
        </Typography>
        {/* <Map setLocation={setLocation} /> */}
        <WeatherChart location={location} />
      </Paper>
    </ThemeProvider>
  );
}

export default Main;
