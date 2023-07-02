import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import useGlobalStore from 'store';
import { useNetwork } from 'wagmi';

import useAutoPayContract from '@/hooks/useAutoPayContract';

import DatePicker from '@/components/DatePicker';
import LoadingScreen from '@/components/loaders';
import PreviewReview from '@/components/prevoiew/Previewreview';
import TokenTable from '@/components/table/TokenTable';

export type TransactionStates = {
  isApproving: boolean;
  isApproved: boolean;
  isTransactionSuccessFul: boolean;
  isTransactionFailed: boolean;
};

const transactionInitialState: TransactionStates = {
  isApproving: false,
  isApproved: false,
  isTransactionSuccessFul: false,
  isTransactionFailed: false,
};
const Time = () => {
  const [transactionstate, setTransactionState] = useState<TransactionStates>(
    transactionInitialState
  );
  const [startTime, setStartTime] = useState<number | null>(null);
  const [noOfCycles, setNoOfCycles] = useState(0);
  const [noOfInterval, setNoOfInterval] = useState('1');
  const [intervalType, setIntervalType] = useState<
    'days' | 'weeks' | 'months' | 'years' | null
  >(null);
  const [isError, setError] = React.useState(false);
  const { enteredRows, sourceTypeMode } = useGlobalStore();
  const isValid = enteredRows.every(
    (item) =>
      item.amount_of_source_token !== '' &&
      item.destination_chain !== 0 &&
      item.destination_token !== '' &&
      item.to_address
  );
  const { fetchAllowance, handleApprove, handleTimeExecution } =
    useAutoPayContract();
  const { chain } = useNetwork();
  const confirmTransaction = async () => {
    try {
      if (!chain || !startTime) return;
      setTransactionState({
        ...transactionInitialState,
        isApproving: true,
      });
      const allowance = await fetchAllowance(chain);
      if (allowance) {
        setTransactionState({
          ...transactionInitialState,
          isApproved: true,
        });
      } else {
        const res = await handleApprove();
        if (res) {
          setTransactionState({
            ...transactionInitialState,
            isApproved: true,
          });
        } else {
          throw new Error('No');
        }
      }

      const res = await handleTimeExecution({
        start_time: startTime,
        cycles: noOfCycles,
        interval_count: noOfInterval,
        interval_type: intervalType,
      });

      if (!res?.hash) {
        throw new Error('Something went wrton');
      }
      setTransactionState({
        ...transactionInitialState,
        isTransactionSuccessFul: true,
      });
    } catch (error) {
      toast.error('Something went wrong');
      setTransactionState({
        ...transactionInitialState,
        isTransactionFailed: true,
      });
    }
  };

  return (
    <div className='w-full'>
      <LoadingScreen
        {...transactionstate}
        handleClose={() => {
          setTransactionState(transactionInitialState);
        }}
      />
      <div className='flex  w-full items-center rounded-[16px] bg-[#272E3C] p-4'>
        <div>
          <p className='mb-2'>Start Time</p>
          <DatePicker
            isError={isError}
            setError={setError}
            onChange={(date) => {
              setStartTime(date);
            }}
          />
        </div>
        {sourceTypeMode === 'Recurring' && (
          <div>
            <input
              title='No of cycles'
              onChange={(e) => {
                setNoOfCycles(parseInt(e.target.value));
              }}
            />
            <input
              title='No of intervals'
              onChange={() => {
                setNoOfInterval('days');
                setIntervalType('days');
              }}
            />
          </div>
        )}
      </div>
      {!isError && startTime && <TokenTable />}
      <div className='h-[50px]' />
      {!isError && startTime && isValid && (
        <PreviewReview
          onClick={() => {
            confirmTransaction();
          }}
        />
      )}
    </div>
  );
};

export default Time;
