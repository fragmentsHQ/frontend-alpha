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
  const { sourceTypeMode, sourceToken } = useGlobalStore();
  const isValid = enteredRows.every(
    (item) =>
      item.amount_of_source_token !== '' &&
      item.amount_of_source_token !== '0' &&
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
    <div className='mt-6 w-full'>
      <LoadingScreen
        {...transactionstate}
        handleClose={() => {
          setTransactionState(transactionInitialState);
        }}
      />
      <div className='flex  w-full items-end justify-between space-x-4 rounded-[10px] bg-[#272E3C] px-4 py-3'>
        <div className='w-[30%]'>
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
          <div className='flex w-[70%] items-end justify-between space-x-4'>
            <input
              title='No of cycles'
              placeholder='Enter no of cycles'
              className='w-full rounded-[6px] border border-[#464646] bg-[#262229] px-4 py-4 focus:outline-none'
              onChange={(e) => {
                setNoOfCycles(parseInt(e.target.value));
              }}
            />
            <div className='w-full'>
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
          </div>
        )}
      </div>
      {!isError && startTime && <TokenTable />}
      <div className='h-[50px]' />
      {!isError && startTime && isValid && (
        <Card className='flex w-[864px] flex-col space-y-10 bg-[#272E3C] p-[26px] shadow-none'>
          <p className='flex w-full justify-center text-[18px] font-normal leading-[28px] text-white'>
            Choose how the task should be paid for. The cost of each execution
            equals the network fee.
          </p>

          <PreviewTabMenu />

          {paymentMethod && (
            <div className=' flex justify-center space-x-3'>
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
