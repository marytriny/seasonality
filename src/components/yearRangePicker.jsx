// Import packages
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

export default function YearRangePicker({start, end, setStart, setEnd}) {
  return(
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Year"
          views={['year']} // enable only year selection
          maxDate={end}
          value={start}
          error={!start}
          onChange={(d) => setStart(d)}
          KeyboardButtonProps={{ 'aria-label': 'change start date' }}
          slotProps={{ textField: { size: 'small' } }} 
        />
      </LocalizationProvider>
      <p style={{ margin: '0 10px' }}> - </p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="End Year"
          views={['year']} // enable only year selection
          disableFuture
          minDate={start}
          maxDate={dayjs()}
          value={end}
          error={!end}
          onChange={(d) => setEnd(d)}
          KeyboardButtonProps={{ 'aria-label': 'change end date' }}
          slotProps={{ textField: { size: 'small' } }} 
        />
      </LocalizationProvider>
    </div>
  )
}