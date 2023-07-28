import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useGlobalStore, { useTableData } from 'store';
import { useNetwork } from 'wagmi';

import useAutoPayContract from '@/hooks/useAutoPayContract';

import Card from '@/components/cards';
import DatePicker from '@/components/DatePicker';
import FrequencyDialog from '@/components/FrequencyDialog';
import LoadingScreen from '@/components/loaders';
import PreviewTabMenu from '@/components/prevoiew/PreviewTab';
import TokenTable from '@/components/table/TokenTable';

export type TransactionStates = {
  isApproving: boolean;
  isTransactionProcessing: boolean;
  isTransactionSuccessFul: boolean;
  isTransactionFailed: boolean;
  hash?: string;
};

const transactionInitialState: TransactionStates = {
  isApproving: false,
  isTransactionProcessing: false,
  isTransactionSuccessFul: false,
  isTransactionFailed: false,
  hash: '',
};
const Time = () => {
  const [transactionstate, setTransactionState] = useState<TransactionStates>(
    transactionInitialState
  );
  const [isApproved, setApproved] = useState(false);
  const { paymentMethod } = useGlobalStore();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [noOfCycles, setNoOfCycles] = useState(0);
  const [noOfInterval, setNoOfInterval] = useState('1');
  const [intervalType, setIntervalType] = useState<
    'days' | 'weeks' | 'months' | 'years' | null
  >(null);
  const [isError, setError] = React.useState(false);
  const { enteredRows } = useTableData();
  const { sourceTypeMode, sourceToken, sourceType, setSourceTypeMode } =
    useGlobalStore();
  const isValid = enteredRows.every(
    (item) =>
      item.amount_of_source_token !== '' &&
      item.amount_of_source_token !== '0' &&
      parseFloat(item.amount_of_source_token) !== 0 &&
      parseFloat(item.amount_of_source_token) > 0 &&
      item.destination_chain !== 0 &&
      item.destination_token !== '' &&
      item.isError === false &&
      item.to_address
  );
  const { fetchAllowance, handleApprove, handleTimeExecution } =
    useAutoPayContract();
  const { chain } = useNetwork();
  const confirmTransaction = async () => {
    try {
      if (!chain || !startTime) return;
      setTransactionState({
        ...transactionstate,
        isTransactionProcessing: true,
      });
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
        hash: res.hash,
      });
    } catch (error) {
      toast.error('Something went wrong');
      setTransactionState({
        ...transactionInitialState,
        isTransactionFailed: true,
      });
    }
  };

  useEffect(() => {
    if (!chain) return;
    fetchAllowance(chain).then((res) => {
      if (res) {
        setApproved(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, sourceToken]);

  return (
    <div className=' mx-auto mt-6 w-full'>
      <LoadingScreen
        {...transactionstate}
        handleClose={() => {
          setTransactionState(transactionInitialState);
        }}
      />
      <div className='mx-auto rounded-[10px] bg-[#272E3C] px-6 py-4'>
        <div className='mb-2 flex  h-[60px] items-center justify-center space-x-10'>
          <div className='flex items-center '>
            <input
              id='default-radio-1'
              type='radio'
              checked={sourceTypeMode === 'conditional'}
              onChange={() => {
                setSourceTypeMode('conditional');
              }}
              name='default-radio'
              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
            />
            <label
              htmlFor='default-radio-1'
              className='ml-2 text-[16px] font-medium '
            >
              Conditional
            </label>
          </div>
          <div className='flex items-center'>
            <input
              defaultChecked
              id='default-radio-2'
              type='radio'
              name='default-radio'
              checked={sourceTypeMode === 'recurring'}
              onChange={() => {
                setSourceTypeMode('recurring');
              }}
              className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
            />
            <label
              htmlFor='default-radio-2'
              className='ml-2 text-[16px] font-medium text-gray-900 dark:text-gray-300'
            >
              Recurring
            </label>
          </div>
        </div>
        <div className='flex  items-center justify-start space-x-6 '>
          <div className='w-full max-w-[50%]'>
            <p className='mb-2'>Start Time</p>
            <DatePicker
              isError={isError}
              setError={setError}
              onChange={(date) => {
                setStartTime(date);
              }}
            />
          </div>
          {sourceType?.toLocaleLowerCase() === 'xstream' && (
            <div className='w-full'>
              <p className='mb-2'>End Time</p>
              <DatePicker
                isError={isError}
                setError={setError}
                onChange={(date) => {
                  setStartTime(date);
                }}
              />
            </div>
          )}

          {sourceTypeMode === 'recurring' && (
            <div className='w-full'>
              <p className='mb-2'>Enter cycles</p>
              <input
                title='No of cycles'
                placeholder='Enter no of cycles'
                className='w-full rounded-[6px] border border-[#464646] bg-[#262229] px-4 py-4 focus:outline-none'
                onChange={(e) => {
                  setNoOfCycles(parseInt(e.target.value));
                }}
              />
            </div>
          )}
          {sourceTypeMode === 'recurring' && (
            <div className='w-full min-w-[200px]'>
              <p className='mb-2'>Select Frequency</p>
              <FrequencyDialog
                setOpen={setDialogOpen}
                open={isDialogOpen}
                intervalType={intervalType}
                setIntervalType={setIntervalType}
                noOfInterval={noOfInterval}
                setNoOfInterval={setNoOfInterval}
              />
            </div>
          )}
        </div>
      </div>
      {!isError && startTime && <TokenTable />}
      {!isError && startTime && isValid && sourceToken && (
        <Card className='mx-auto mt-6 flex w-full flex-col  space-y-10 bg-[#272E3C] p-[26px] shadow-none'>
          <p className='flex w-full justify-center text-[18px] font-normal leading-[28px] text-white'>
            Choose how the task should be paid for. The cost of each execution
            equals the network fee.
          </p>
          <div className='mx-auto w-full max-w-[80%]'>
            <PreviewTabMenu />
          </div>

          {paymentMethod && (
            <div className=' mx-auto flex w-full max-w-[80%] justify-center space-x-3'>
              <button
                onClick={async () => {
                  try {
                    if (!chain) return;
                    setTransactionState({
                      ...transactionInitialState,
                      isApproving: true,
                    });
                    const allowance = await fetchAllowance(chain);
                    if (allowance) {
                      setApproved(true);
                      setTransactionState({
                        ...transactionInitialState,
                        isApproving: false,
                      });
                    } else {
                      const res = await handleApprove();
                      if (res) {
                        setApproved(true);
                        setTransactionState({
                          ...transactionInitialState,
                          isApproving: false,
                        });
                      } else {
                        throw new Error('No');
                      }
                    }
                  } catch (error) {
                    setApproved(false);
                    setTransactionState({
                      ...transactionInitialState,
                      isApproving: false,
                    });
                  }
                }}
                disabled={isApproved}
                className='rounded-[12px] bg-[#0047CE] px-20 py-3 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#262229] disabled:bg-opacity-50 disabled:text-opacity-20'
              >
                {' '}
                Confirm Token Allowance
              </button>
              <button
                disabled={!isApproved}
                onClick={() => {
                  confirmTransaction();
                }}
                className='rounded-[12px] bg-[#0047CE] px-20 py-3 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#262229] disabled:bg-[#464646] disabled:bg-opacity-50 disabled:text-opacity-20'
              >
                {' '}
                Confirm by signing
              </button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Time;
