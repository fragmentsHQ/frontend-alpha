
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';

interface IDatePicker {
  defaultValue?: Dayjs,
  onChange: (value: Dayjs) => void
}

const DatePicker: React.FC<IDatePicker> = (props) => {
  const [value, setValue] = React.useState<Dayjs | null>(
    dayjs().add(1, 'hour')
  );


  const handleChange = (newValue) => {
    const d = dayjs(newValue).unix();
    props.onChange(d)
  };
  

  return (
    <div className='flex items-center justify-start'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          
          label=''
          disablePast
          value={value}
          onChange={(value) => {
            setValue(dayjs(new Date(value)));
            handleChange(value);
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
          slotProps={{
            textField: {
              inputProps: { className:"text-white"}
            }
          }} 
        />
      </LocalizationProvider>
    </div>
  );
}

export default DatePicker