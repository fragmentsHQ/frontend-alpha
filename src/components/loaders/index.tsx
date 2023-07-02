import Backdrop from '@mui/material/Backdrop';
import Image from 'next/image';
import { useRouter } from 'next/router';
import * as React from 'react';

import { TransactionStates } from '@/components/TriggerValues/Time';

export default function LoadingScreen({
  isApproving,
  isApproved,
  isTransactionSuccessFul,
  isTransactionFailed,
  handleClose,
  hash,
}: TransactionStates & {
  handleClose: () => void;
}) {
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          isApproving ||
          isApproved ||
          isTransactionSuccessFul ||
          isTransactionFailed
        }
        onClick={() => {
          if (isTransactionFailed || isTransactionSuccessFul) {
            handleClose();
          } else {
            return null;
          }
        }}
      >
        {isApproving && <Allowance />}
        {isApproved && <TransactionPending />}
        {isTransactionSuccessFul && (
          <TransactionSuccessfull
            handleClose={handleClose}
            hash={hash as string}
          />
        )}
        {isTransactionFailed && (
          <TransactionFailed handleClose={handleClose} hash={hash as string} />
        )}
      </Backdrop>
    </div>
  );
}

const Allowance = () => {
  return (
    <div className='flex h-[300px] w-[400px] flex-col items-center justify-center rounded-[10px] bg-[#262229] p-4'>
      <Image
        src={require('../../../public/loading.png')}
        width={100}
        height={100}
        title='Loading'
        className='mb-3 animate-spin'
        alt='Loading'
      />
      <p className='mx-auto w-[80%] text-center font-bold'>
        click ‘use default’ and confirm allowance to setup your automation
      </p>
      <div className='mt-4 text-center'>
        Gas fees for all transactions will be forward paid in this token when
        their trigger conditions are met.
      </div>
    </div>
  );
};

const TransactionPending = () => {
  return (
    <div className='flex h-[250px] w-[300px] flex-col items-center justify-center rounded-[10px] bg-[#262229] p-4'>
      <Image
        src={require('../../../public/loading.png')}
        width={100}
        height={100}
        title='Loading'
        className='mb-3 animate-spin'
        alt='Loading'
      />
      <p className='mx-auto w-[80%] text-center font-bold'>
        Waiting for approval confirmation on-chain
      </p>
    </div>
  );
};

const TransactionSuccessfull = ({
  hash,
  handleClose,
}: {
  hash: string;
  handleClose: () => void;
}) => {
  const router = useRouter();
  return (
    <div className='flex  w-[300px] flex-col items-center justify-center rounded-[10px] bg-[#262229] p-4'>
      <Image
        src={require('../../../public/success.png')}
        width={130}
        height={130}
        title='Loading'
        className='mb-3 '
        alt='Loading'
      />
      <a
        href={hash}
        className='etherscan mb-2 flex items-center justify-center text-[14px] text-[#A0A0A0] underline'
      >
        view on etherscan <Arrow />
      </a>
      <p className='mx-auto w-[80%] text-center font-bold'>
        Transaction Successful
      </p>
      <button
        onClick={() => {
          router.push('/jobs');
        }}
        className=' mt-4 w-[90%] rounded-lg bg-white px-4 py-4 text-[#1867FD]'
      >
        View Job
      </button>
      <button
        onClick={() => {
          handleClose();
        }}
        className='mt-2 w-[90%] rounded-lg bg-[#1867FD] px-4 py-4'
      >
        Create new job
      </button>
    </div>
  );
};
const TransactionFailed = ({
  handleClose,
  hash,
}: {
  handleClose: () => void;
  hash: string;
}) => {
  return (
    <div className='flex  w-[300px] flex-col items-center justify-center rounded-[10px] bg-[#262229] p-4'>
      <Image
        src={require('../../../public/failed.png')}
        width={130}
        height={130}
        title='Loading'
        className='mb-3 '
        alt='Loading'
      />
      <a
        href={hash}
        className='etherscan mb-2 flex items-center justify-center text-[14px] text-[#A0A0A0] underline'
      >
        view on etherscan <Arrow />
      </a>
      <p className='mx-auto w-[80%] text-center font-bold'>
        Transaction Failed
      </p>
      <button
        onClick={() => {
          handleClose();
        }}
        className=' mt-4 w-[90%] rounded-lg bg-white px-4 py-4 text-[#1867FD]'
      >
        Retry
      </button>
      <button
        onClick={() => {
          handleClose();
        }}
        className='mt-2 w-[90%] rounded-lg bg-[#1867FD] px-4 py-4'
      >
        Create new job
      </button>
    </div>
  );
};

const Arrow = () => {
  return (
    <svg
      width={19}
      height={18}
      viewBox='0 0 19 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.75 12.75L13.25 5.25'
        stroke='#A0A0A0'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M5.75 5.25H13.25V12.75'
        stroke='#A0A0A0'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
