import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useGlobalStore, { useTableData } from 'store';
import { useAccount, useBalance, useNetwork } from 'wagmi';

import useAutoPayContract from '@/hooks/useAutoPayContract';

import Card from '@/components/cards';
import DatePicker from '@/components/DatePicker';
import FrequencyDialog from '@/components/FrequencyDialog';
import LoadingScreen from '@/components/loaders';
import PreviewTabMenu, {
  AutomationArguments,
} from '@/components/prevoiew/PreviewTab';
import TokenTable from '@/components/table/TokenTable';
import { Checkbox, FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import clsxm from '@/lib/clsxm';
import { Token } from '@/config/tokens';

export type TransactionStates = {
  isApproving: boolean;
  isTransactionProcessing: boolean;
  isTransactionSuccessFul: boolean;
  isTransactionFailed: boolean;
  showJobSection?: boolean;
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
  const [gasMethods, setGasMethods] = useState<AutomationArguments | null>(
    null
  );
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
        isForwardPayingGas:
          gasMethods === AutomationArguments.FORWARD_PAYING_GAS,
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

  const isRecurring =
    sourceTypeMode === 'recurring' ? (noOfCycles === 0 ? false : true) : true;

  return (
    <div className=' mx-auto mt-6 w-full'>
      <LoadingScreen
        {...transactionstate}
        showJobSection={true}
        handleClose={() => {
          setTransactionState(transactionInitialState);
        }}
      />
      <div className='relative mx-auto rounded-[10px] bg-[#272E3C] px-6 py-4'>
        <div className='-mr-2 -mt-2 mb-2 flex items-center justify-end'>
          {sourceType?.toLocaleLowerCase() === 'autopay' && (
            <FormControlLabel
              checked={sourceTypeMode === 'recurring'}
              onChange={() => {
                if (sourceTypeMode === 'recurring') {
                  setNoOfCycles(0);
                  setIntervalType(null);
                  setSourceTypeMode('conditional');
                  return;
                }
                setSourceTypeMode('recurring');
              }}
              control={
                <Checkbox
                  sx={{
                    color: '#ffff',
                    '&.Mui-checked': {
                      color: '#1867FD',
                    },
                  }}
                />
              }
              label='Recurring Payments'
            />
          )}
        </div>
        <div className='flex  items-center justify-start space-x-6 '>
          <div className='w-full max-w-[48%]'>
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
                defaultDateTime={dayjs().add(2, 'hour')}
                setError={setError}
                onChange={(date) => {
                  setStartTime(date);
                }}
              />
            </div>
          )}

          {sourceTypeMode === 'recurring' &&
            sourceType?.toLocaleLowerCase() === 'autopay' && (
              <div className='w-full'>
                <p className='mb-2'>Enter cycles</p>
                <input
                  title='No of cycles'
                  value={noOfCycles === 0 ? '' : noOfCycles}
                  placeholder='Enter no of cycles'
                  type='number'
                  className={clsxm(
                    'w-full rounded-[6px] border border-[#464646] bg-[#262229] px-4 py-4 focus:border-[#464646] focus:outline-none focus:ring-0',
                    !isRecurring && 'border-red-500 placeholder:text-white'
                  )}
                  onChange={(e) => {
                    if (e.target.value === '' || e.target.value === '0') {
                      setNoOfCycles(0);
                      return;
                    }
                    setNoOfCycles(parseInt(e.target.value));
                  }}
                />
              </div>
            )}
          {sourceTypeMode === 'recurring' &&
            sourceType?.toLocaleLowerCase() === 'autopay' && (
              <div className='w-full min-w-[200px]'>
                <p className='mb-2'>Selected Frequency</p>
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

      {!isError && startTime && isValid && sourceToken && isRecurring && (
        <>
          <Card className='mx-auto mt-6 flex w-full flex-col  space-y-10 bg-[#272E3C] p-[26px] shadow-none'>
            <p className='flex w-full justify-center text-[18px] font-normal leading-[28px] text-white'>
              Choose how the task should be paid for. The cost of each execution
              equals the network fee.
            </p>
            <div className='mx-auto w-full max-w-[80%]'>
              <PreviewTabMenu
                gasMethods={gasMethods}
                setGasMethods={(value) => {
                  setGasMethods(value);
                }}
              />
              {sourceToken && <WalletBalance token={sourceToken} />}
            </div>
          </Card>
          {gasMethods && (
            <div className=' mx-auto mt-6 flex w-full max-w-[100%] justify-center space-x-6'>
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
                className='w-full rounded-[12px] bg-[#0047CE] px-20 py-4 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#464646] disabled:bg-opacity-50 disabled:text-opacity-20'
              >
                {' '}
                Confirm Token Allowance
              </button>
              <button
                disabled={!isApproved}
                onClick={() => {
                  confirmTransaction();
                }}
                className='w-full rounded-[12px] bg-[#0047CE] px-20 py-4 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#464646]  disabled:bg-opacity-50 disabled:text-opacity-20'
              >
                {' '}
                Confirm by signing
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Time;

const WalletBalance = ({ token }: { token: Token }) => {
  const { address } = useAccount();
  const { data } = useBalance({
    address: address,
    token: token.address,
  });
  if (!data) {
    return null;
  }
  return (
    <div className='mt-2 text-right'>
      Wallet balance : {parseFloat(data.formatted).toFixed(5)}&nbsp;
      {data.symbol}
    </div>
  );
};
