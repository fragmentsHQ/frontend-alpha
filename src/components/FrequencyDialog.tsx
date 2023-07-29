import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';

export default function FrequencyDialog({
  open,
  setOpen,
  noOfInterval,
  intervalType,
  setNoOfInterval,
  setIntervalType,
}: {
  open: boolean;
  noOfInterval: string;
  intervalType: 'days' | 'months' | 'years' | 'weeks' | null;
  setNoOfInterval: React.Dispatch<React.SetStateAction<string>>;
  setIntervalType: React.Dispatch<
    React.SetStateAction<'days' | 'months' | 'years' | 'weeks' | null>
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleChange = (event: SelectChangeEvent<typeof intervalType>) => {
    setIntervalType(event.target.value as typeof intervalType);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <div>
      <div
        onClick={handleClickOpen}
        className='w-full cursor-pointer rounded-[6px] border border-[#464646] bg-[#262229] px-4 py-4 focus:outline-none'
      >
        Select Frequency ({noOfInterval} {intervalType || 'day'})
      </div>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle
          style={{
            backgroundColor: '#262229',
          }}
        >
          Select Frequency
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: '#262229',
          }}
        >
          <Box
            component='form'
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              backgroundColor: '#262229',
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <input
                title='No of intevale'
                placeholder='Enter no of cycles'
                value={noOfInterval}
                className='w-full rounded-[6px] border border-[#464646] bg-[#262229] px-4 py-4 focus:outline-none'
                onChange={(e) => {
                  setNoOfInterval(e.target.value.toString());
                }}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                labelId='demo-dialog-select-label'
                id='demo-dialog-select'
                value={intervalType}
                onChange={handleChange}
                input={<OutlinedInput />}
              >
                <MenuItem value='days'>days</MenuItem>
                <MenuItem value='weeks'>weeks</MenuItem>
                <MenuItem value='months'>months</MenuItem>
                <MenuItem value='years'>years</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: '#262229',
          }}
        >
          <Button
            onClick={(e) => {
              setIntervalType('days');
              setNoOfInterval('1');
              handleClose(e);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
