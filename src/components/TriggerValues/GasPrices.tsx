import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useGlobalStore, { useTableData } from 'store';
import { Chain, useNetwork } from 'wagmi';

import useAutoPayContract from '@/hooks/useAutoPayContract';
import useGasPriceEstimate from '@/hooks/useGasPriceEstimate';

import Card from '@/components/cards';
import LoadingScreen from '@/components/loaders';
import PreviewTabMenu from '@/components/prevoiew/PreviewTab';
import TokenTable from '@/components/table/TokenTable';

import { CHAIN_IMAGES } from '@/config/tokens';

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
const GasPrice = () => {
  const [transactionstate, setTransactionState] = useState<TransactionStates>(
    transactionInitialState
  );
  const [isApproved, setApproved] = useState(false);
  const { paymentMethod } = useGlobalStore();
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [gas, setGas] = useState<string | null>(null);
  const { sourceToken } = useGlobalStore();
  const { enteredRows } = useTableData();
  const isValid = enteredRows.every(
    (item) =>
      item.amount_of_source_token !== '' &&
      item.amount_of_source_token !== '0' &&
      item.destination_chain !== 0 &&
      item.destination_token !== '' &&
      item.to_address
  );
  const { fetchAllowance, handleApprove } = useAutoPayContract();
  const { handleConditionalExecution } = useGasPriceEstimate();
  const { chain, chains } = useNetwork();
  const confirmTransaction = async () => {
    try {
      if (!chain || !gas || !selectedChain) return;
      setTransactionState({
        ...transactionstate,
        isTransactionProcessing: true,
      });
      const res = await handleConditionalExecution({
        gas: gas,
        _chain: selectedChain,
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
    setSelectedChain(chain);
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
        <div className='flex w-[100%] items-end justify-between space-x-4'>
          <div className='w-full'>
            <p className='mb-2'>Enter gas</p>
            <div className='flex items-center justify-between rounded-[6px] border border-[#464646] bg-[#262229]'>
              <input
                title='Enter gas'
                placeholder='Enter gas'
                type='number'
                className='w-full  border-none bg-transparent px-4 py-4 focus:border-none focus:outline-none focus:ring-0'
                onChange={(e) => {
                  setGas(e.target.value);
                }}
              />
              <div className='mr-2 rounded-md bg-gray-900 px-2 py-2'>Gwei</div>
            </div>
          </div>

          <div className='w-full'>
            <Menu as='div' className='relative w-full'>
              <p className='mb-2'>Select chain</p>

              <Menu.Button className='align-left flex w-full  items-center justify-between rounded-[10px] border border-[#464646] bg-[#262229] px-5 py-4 text-[18px] disabled:cursor-not-allowed  '>
                <div className='font-normal text-white'>
                  <div className='flex items-center space-x-2'>
                    {selectedChain && (
                      <div className='relative h-[20px] w-[20px]'>
                        <Image
                          src={CHAIN_IMAGES[selectedChain?.id].image_url}
                          alt={selectedChain?.name || ''}
                          fill
                          className='rounded-full'
                        />
                      </div>
                    )}

                    <div>{selectedChain?.name}</div>
                  </div>
                </div>
                <ChevronDownIcon
                  className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
                  aria-hidden='true'
                />
              </Menu.Button>
              <Menu.Items className='absolute right-0 mt-2 flex w-full origin-top-right flex-col rounded-md bg-[#262229] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                {chains.map((option, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <div
                        className={`${
                          active && 'bg-[#282828]'
                        } flex w-full cursor-pointer items-center space-x-2 px-4 py-2 text-white`}
                        onClick={() => setSelectedChain(option)}
                      >
                        {option.id && (
                          <div className={`relative h-[20px] w-[20px] `}>
                            <Image
                              src={CHAIN_IMAGES[option.id].image_url}
                              alt={option.name || ''}
                              fill
                              className='rounded-full'
                            />
                          </div>
                        )}

                        <div>{option.name}</div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
      {gas && gas !== '0' && selectedChain && <TokenTable />}
      <div className='h-[50px]' />
      {gas && gas !== '0' && selectedChain && isValid && (
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

export default GasPrice;
