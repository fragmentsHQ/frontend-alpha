import React, { useState } from 'react';

interface LoadingModalProps {
  isOpen: boolean;
}

const FailedModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  const [open, setOpen] = useState(isOpen);

  const handleOverlayClick = () => {
    // Prevent closing if the modal content is clicked
    setOpen(false);
  };

  return (
    <>
      {open ? (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center'
          onClick={() => handleOverlayClick()}
        >
          <div className='fixed inset-0 bg-[#282828] opacity-30'></div>
          <div className='z-50 flex h-[500px] w-[395px] flex-col justify-between  rounded-md bg-[#262229] p-8'>
            <div className='flex flex-col items-center space-y-5'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-[180px] w-[180px] rounded-full bg-[#63727E] text-[#EEF8EF]'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>

              <span className='text-[24px] font-bold text-white'>Failed</span>
              <span className='flex items-center space-x-1 rounded-md bg-[#464646] px-4 py-[3px]'>
                <a className='cursor-pointer text-[16px] text-[#AFAEAE] underline'>
                  view tx. on etherscan
                </a>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-3 w-3 cursor-pointer text-[#AFAEAE]'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25'
                  />
                </svg>
              </span>
            </div>
            <div className='flex flex-col space-y-5'>
              <button className='w-full rounded-lg bg-white py-3 text-[18px] font-semibold text-[#1867FD]'>
                Retry
              </button>
              <button className='w-full rounded-lg bg-[#1867FD] py-3 text-[18px] font-semibold text-white'>
                Create New Job
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FailedModal;
