
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';

export default function DatePicker() {
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs().add(1, 'hour')
  );


  const handleChange = (newValue) => {
    const d = dayjs(newValue).unix();
  };
  

  return (
    <div className='flex items-center justify-start'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          
          label=''
          disablePast
          value={value}
          onChange={(da) => {
            setValue(dayjs(new Date(da)));
            handleChange(da);
          }}
          views={['year', 'day', 'hours', 'minutes']}
          // onError={(data) => {
          //   setError(!!data);
          //   if (data) {
          //     toast.error('Invalid date selected');
              
          //   }
          // }}
          // onAccept={() => {
          //   if (!isError) {
             
          //   }
          // }}
          
        />
      </LocalizationProvider>
    </div>
  );
}