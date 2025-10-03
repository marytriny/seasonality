// Import Packages
import axios from "axios";
import dayjs from 'dayjs';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { TextField, Tooltip, IconButton, LinearProgress, Typography } from '@mui/material';

// Local imports
import YearRangePicker from "./yearRangePicker";
import Graph from "./Graph";

// Extract year/month from date string
function monthKey(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return { year: String(d.getUTCFullYear()), month: d.getUTCMonth() + 1 };
}

// Aggregate daily → monthly average 
function aggregateMonthly(data) {
  const map = {};

  data.daily.time.forEach((t, i) => {
    const { year, month } = monthKey(t);
    const key = `${year}-${month}`;
    if (!map[key]) map[key] = { year, month, temps: [] };

    const tmean = Number(data.daily.temperature_2m_mean?.[i]);
    map[key].temps.push(tmean);
  });

  return Object.values(map).map(d => ({
    year: d.year,
    month: d.month,
    value: d.temps.reduce((a, b) => a + b, 0) / d.temps.length
  }));
}

function toRecharts(monthly) {
  const years = Array.from(new Set(monthly.map(d => d.year))).sort();
  return Array.from({ length: 12 }, (_, idx) => {
    const m = idx + 1; // 1..12
    const row = { month: m };
    years.forEach(y => {
      const hit = monthly.find(d => d.year === y && d.month === m);
      if (hit) row[y] = Number(hit.value.toFixed(2));
    });
    return row;
  });
}

export default function WeatherChart({ location }) {

  // Date range (in years)
  const [startYear, setStartYear] = useState(dayjs('2020-01-01'));
  const [endYear, setEndYear] = useState(dayjs('2024-01-01'));

  // Data
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);

  // Track loading of data
  const [loadingData, setLoadingData] = useState(false);

  // Temporarily adjust chart's max Y value and X range
  const [maxY, setMaxY] = useState()
  const [refArea, setRefArea] = useState({ x1: "", x2: "" })
  const [currData, setCurrData] = useState(data);

  // Set current data 
  useEffect(() => {
    setCurrData(data);
  }, [data])

  // Get chart data for selected location and dates
  // Open Meteo Docs: https://open-meteo.com/en/docs/historical-weather-api
  useEffect(() => {
    // console.log(location)
    if (!location[0] || !location[1]) return;

    setLoadingData(true);

    axios.get("https://archive-api.open-meteo.com/v1/archive", {
      params: {
        latitude: location[1],
        longitude: location[0],
        start_date: startYear.format('YYYY-MM-DD'),
        end_date: endYear.format('YYYY-MM-DD'),
        timezone: "auto",
        daily: "temperature_2m_mean",
        temperature_unit: "fahrenheit"
      }
    }).then((res) => {
      // console.log(res.data);
      const monthly = aggregateMonthly(res.data);
      const chartData = toRecharts(monthly);
      setData(chartData);
      setYears(Object.keys(chartData[0]).filter(k => k !== "month"));
    }).catch((err) => {
      toast.error('Error loading chart')
      console.error("Failed to get chart data: ", err)
    }).finally(() => setLoadingData(false));
  }, [location, startYear, endYear]);

  // Zoom in to the highlighted section in Seasonality graphs
  function zoom() {
    let { x1, x2 } = refArea;
    // Handle edge cases where x1 or x2 are invalid
    if (x1 === x2 || x1 === '' || x2 === '' || isNaN(x1) || isNaN(x2)) {
      return setRefArea({ x1: "", x2: "" });
    }
    // Handle case where one highlights from right to left
    if (Number(x1) > Number(x2)) {
      [x1, x2] = [x2, x1]
    };

    // Temporarily slice data to the section highlighted
    setCurrData(data.slice(x1, x2 + 1));
    setRefArea({ x1: "", x2: "" });
  }

  // Zoom out to view the full graph
  function zoomOut() {
    setCurrData(data)
    setRefArea({ x1: "", x2: "" });
  }

  // Set max Y value for all graphs within the section
  // If an invalid value is provided, there is no change.
  // If the value is less than the highest number in the graph,
  // then the max Y value will be the highest number instead of the one provided.
  const handleMaxYChange = (event) => {
    const { target: { value } } = event;
    return setMaxY((!value || isNaN(value)) ? null : Number(value))
  }
  
  return (
    <div>
      <div className='flex-row'>
        {/* Year Picker */}
        <YearRangePicker
          start={startYear}
          end={endYear}
          setStart={setStartYear}
          setEnd={setEndYear}
        />
        {/* Adjust chart values */}
        { data &&
          <div>
            {/* Set max value for Y-axis in all graphs in the row */}
            <TextField
              label= 'Set Y-Max'
              size='small'
              margin="dense"
              defaultValue={maxY}
              onChange={handleMaxYChange}
              sx={{ width: '110px' }}
            />
            {/* Zoom out of highlighted area in chart */}
            <Tooltip title="Zoom Out">
              <IconButton onClick={zoomOut} size="large">
                <ZoomOutIcon fontSize="inherit"/>
              </IconButton>
            </Tooltip>
          </div>
        }
      </div>
      {loadingData ? (
        <div style={{ margin: '0 1px'}}>
          <Typography className='graph-no-data'>
            Loading weather data...
          </Typography>
          <LinearProgress/>
        </div>
      ): (
        <div style={{ width: "100%", height: 450 }}>
          <Graph
            lines={years}
            data={currData || []}
            maxY={maxY}
            refArea={refArea}
            setRefArea={setRefArea}
            zoom={zoom}
          />
        </div>
      )}
    </div>
  );
}
