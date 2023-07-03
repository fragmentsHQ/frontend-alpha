import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useGlobalStore, { useTableData } from 'store';
import { useNetwork } from 'wagmi';

import useAutoPayContract from '@/hooks/useAutoPayContract';
import usePriceFeed from '@/hooks/usePriceFeed';

import Card from '@/components/cards';
import LoadingScreen from '@/components/loaders';
import { TokenMenu } from '@/components/menu/ChainMenu';
import PreviewTabMenu from '@/components/prevoiew/PreviewTab';
import TokenTable from '@/components/table/TokenTable';

import { Token, TOKENS } from '@/config/tokens';

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
const TokenPairPrice = () => {
  const [transactionstate, setTransactionState] = useState<TransactionStates>(
    transactionInitialState
  );
  const [isApproved, setApproved] = useState(false);
  const { paymentMethod } = useGlobalStore();
  const [ratio, setRatio] = useState(1);

  const { enteredRows } = useTableData();
  const [tokenA, setTokenA] = useState<
    | (Token & {
        value: string;
      })
    | null
  >(null);
  const [tokenB, setTokenB] = useState<
    | (Token & {
        value: string;
      })
    | null
  >(null);
  const { sourceToken } = useGlobalStore();
  const isValid = enteredRows.every(
    (item) =>
      item.amount_of_source_token !== '' &&
      item.amount_of_source_token !== '0' &&
      item.destination_chain !== 0 &&
      item.destination_token !== '' &&
      item.to_address
  );
  const { fetchAllowance, handleApprove } = useAutoPayContract();
  const { handleConditionalExecution } = usePriceFeed();
  const { chain } = useNetwork();
  const confirmTransaction = async () => {
    try {
      if (!chain || !tokenA || !tokenB) return;
      setTransactionState({
        ...transactionstate,
        isTransactionProcessing: true,
      });
      const res = await handleConditionalExecution({
        ratio: ratio.toString(),
        token1: tokenA?.address,
        token2: tokenB?.address,
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
    setTokenA({
      ...TOKENS[chain.id][0],
      value: '',
    });
    setTokenB({ ...TOKENS[chain.id][1], value: '' });
    fetchAllowance(chain).then((res) => {
      if (res) {
        setApproved(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, sourceToken]);

  useEffect(() => {
    if (tokenA?.value === '' || tokenB?.value === '') {
      setRatio(0);
      return;
    }
    setRatio(Number(tokenA?.value) / Number(tokenB?.value));
  }, [tokenA?.value, tokenB?.value]);

  return (
    <div className='mt-6 w-full max-w-7xl'>
      <LoadingScreen
        {...transactionstate}
        handleClose={() => {
          setTransactionState(transactionInitialState);
        }}
      />
      <div className='rounded-[10px] bg-[#272E3C] px-4 py-3'>
        <div className='flex w-full flex-wrap items-end justify-between  '>
          <div className='flex w-[100%] items-end justify-between space-x-4'>
            <div className='w-[35%]'>
              <p className='mb-2'>Select Token A</p>
              <div className='flex w-full justify-between rounded-[6px] border border-[#464646] bg-[#262229] px-2 py-2 focus:outline-none'>
                <input
                  title='Enter amount'
                  placeholder='Enter amount'
                  type='number'
                  className='max-w-[120px] border-none bg-transparent focus:outline-none focus:ring-0'
                  onChange={(e) => {
                    if (tokenA) {
                      setTokenA({
                        ...tokenA,
                        value: e.target.value || '',
                      });
                    }
                  }}
                />
                <TokenMenu
                  initialToken={tokenA?.address as string}
                  onTokenChange={(token) => {
                    if (token)
                      setTokenA({ ...token, value: tokenA?.value || '' });
                  }}
                />
              </div>
            </div>
            <div className='w-[35%]'>
              <p className='mb-2'>Select Token B</p>
              <div className='flex w-full justify-between rounded-[6px] border border-[#464646] bg-[#262229] px-2 py-2 focus:outline-none'>
                <input
                  title='Select Token B'
                  placeholder='Enter amount'
                  type='number'
                  className='max-w-[130px] border-none bg-transparent focus:outline-none focus:ring-0'
                  onChange={(e) => {
                    if (tokenB) {
                      setTokenB({
                        ...tokenB,
                        value: e.target.value || '',
                      });
                    }
                  }}
                />
                <TokenMenu
                  initialToken={tokenB?.address as string}
                  onTokenChange={(token) => {
                    if (token)
                      setTokenB({ ...token, value: tokenB?.value || '' });
                  }}
                />
              </div>
            </div>
            <div className='w-[20%]'>
              <p className='mb-2'>Ratio</p>
              <input
                title='No of cycles'
                placeholder='Ratio'
                disabled={true}
                value={ratio || ''}
                className='w-full rounded-[6px] border border-[#464646] bg-[#262229] px-4 py-3 focus:outline-none'
                onChange={(e) => {
                  setRatio(parseInt(e.target.value));
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {tokenA?.value !== '' && tokenB?.value !== '' && <TokenTable />}
      <div className='h-[50px]' />
      {isValid && tokenA?.value !== '' && tokenB?.value !== '' && (
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
                    } else {
                      const res = await handleApprove();
                      if (res) {
                        setApproved(true);
                      } else {
                        throw new Error('No');
                      }
                    }
                    setTransactionState({
                      ...transactionInitialState,
                      isApproving: false,
                    });
                  } catch (error) {
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

export default TokenPairPrice;
