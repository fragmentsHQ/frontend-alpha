import { CircularProgress } from '@mui/material';
import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='fixed inset-0 bg-[#282828] opacity-30'></div>
      <div className='z-50 rounded-md bg-[#262229] p-8'>
        <div className='mb-5 flex w-full items-center justify-center'>
          <CircularProgress color='inherit' />
        </div>
        <div className='flex flex-col items-center justify-center space-y-5'>
          <p className='max-w-[300px] text-center text-[20px] text-white'>
            Click use default and confirm allowance to setup your automation
          </p>
          <p className='max-w-[300px] text-center text-[14px] text-[#AFAEAE]'>
            Gas fees for all transactions will be forward paid in this token
            when their trigger conditions are met.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
