import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import toast from 'react-hot-toast';

export default function DatePicker({
  isError,
  setError,
  defaultDateTime = dayjs().add(30, 'minutes'),
  onChange,
}: {
  isError: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (date: number | null) => void;
  defaultDateTime?: Dayjs | null;
}) {
  const [value, setValue] = React.useState<Dayjs | null>(defaultDateTime);

  const handleChange = (newValue: dayjs.Dayjs) => {
    setError(false);
    const d = dayjs(newValue).unix();
    if (isError) {
      console.error('Invalid date');
      onChange(null);
    } else {
      onChange(d);
    }
  };

  React.useEffect(() => {
    if (isError) {
      console.error('Invalid date');
      onChange(null);
    } else {
      onChange(dayjs(value).unix());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className='flex items-center justify-start border-none bg-[#262229]'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label=''
          disablePast
          className='w-full'
          value={value}
          onChange={(date) => {
            if (date) {
              setValue(dayjs(date));
              handleChange(date);
            }
          }}
          onError={(data) => {
            setError(!!data);
            if (data) {
              console.error('Invalid date selected');
            }
          }}
          onAccept={() => {
            if (!isError) {
              toast.error('Invalid date selected');
            }
          }}
          // renderInput={(params) => (
          //   <TextField
          //     {...params}
          //     inputProps={{ ...params.inputProps, readOnly: true }}
          //   />
          // )}
        />
      </LocalizationProvider>
    </div>
  );
}
