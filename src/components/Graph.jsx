// Import Packages
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceArea
} from 'recharts';

// Month labels used in chart
const MONTH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Colors to use for graph lines
const COLOR = ['#FF780A', '#58A64B', '#3274AA', '#A352CC', '#FF0000', '#E5AC31', '#FF1493'];

// Generate a random color
const getRandomColor = () =>
  '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');

// Get stroke color for each line
const getStrokeColor = (i) => {
  if (!COLOR[i]) COLOR[i] = getRandomColor();
  return COLOR[i];
}

const Graph = ({
  data, 
  lines,
  maxY,
  refArea, 
  setRefArea,
  zoom
}) => {
  const theme = useTheme();

  // Lock tooltip on click. If false, the tooltip will only show on hover.
  const [lockTooltip, setLockTooltip] = useState(false)
  const [hideLine, setHideLine] = useState({})

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      {( data && data.length > 0) ? (
        <ResponsiveContainer width={'100%'} height={300}>
          <LineChart
            syncId="all" // Allows us to synchronize tooltips in all graphs
            data={data}
            onClick={() => setLockTooltip(!lockTooltip)}
            margin={{ right: 15 }} // Add margin so last tick is not cut off the X-axis
            // Track when user highlights a section to zoom in to it (by clicking and dragging mouse across graph).
            onMouseDown={(e) => refArea && setRefArea({ ...refArea, x1: e.activeLabel })}
            onMouseMove={(e) => refArea?.x1 && setRefArea({ ...refArea, x2: e.activeLabel })}
            onMouseUp={zoom}
            >
            {lines.map((line, i) =>
              <Line
                key={line}
                dataKey={line}
                hide={hideLine[line]}
                stroke={getStrokeColor(i)}
                strokeWidth={2}
                dot={false}
              />
            )}
            <XAxis
              dataKey="month"
              tickFormatter={(m) => MONTH[m - 1]} // display names
              stroke={theme.palette.text.secondary}
              axisLine={false}
            />
            <YAxis
              domain={maxY ? [0, maxY] : [0, 'auto']} // Set the range of values
              type="number"
              stroke={theme.palette.text.secondary}
              axisLine={false}
            />
            {refArea.x1 && refArea.x2 &&
              <ReferenceArea x1={refArea.x1} x2={refArea.x2} />}
            <Tooltip
              trigger={lockTooltip ? 'click' : 'hover'} // Lock tooltip on click. Otherwise, only show on hover.
              labelFormatter={(m) => MONTH[m - 1]} // display names
              contentStyle={{ backgroundColor: theme.palette.bg }}
            />
            <CartesianGrid stroke={theme.palette.grid} strokeDasharray="3" />
            <Legend onClick={(e) => setHideLine({...hideLine, [e.dataKey]: !e.inactive})} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ margin: '0 1px'}}>
          <Typography className='graph-no-data'>
            No data <br/>
            Plot a point to begin
          </Typography>
        </div>
      )}
    </div>
  )
}

export default Graph;
