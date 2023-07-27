import { Tab } from '@headlessui/react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import useDepositBalance from '@/hooks/useDepositBalance';
import useGetTreasuryBalance from '@/hooks/useGetTreasuryBalance';
import useWithdrawBalance from '@/hooks/useWithdrawBalance';

import Layout from '@/components/layout/Layout';
import AllTransactionTable from '@/components/table/transactions/AllTransactions';
import DepositTransactionTable from '@/components/table/transactions/DepositTransactions';
import WithdrawTransactionTable from '@/components/table/transactions/WithdrawTransactions';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Profile = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Deposit');
  const [selectedTableCategory, setSelectedTableCategory] = useState('All');
  const [inputAmount, setInputAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const balanceETH = useGetTreasuryBalance();
  const { sendWithdrawTokenAsyncTxn } = useWithdrawBalance({
    inputAmount: parseFloat(withdrawAmount),
  });

  const { sendDepositTokenAsyncTxn } = useDepositBalance({
    inputAmount: parseFloat(inputAmount),
  });

  const panels = {
    Deposit: (
      <div className='W-full grid grid-cols-4 gap-6'>
        <input
          placeholder='0.0'
          type='number'
          className='col-span-3 h-12 rounded-xl bg-[#262229] focus:outline-none'
          onChange={(e) => {
            setInputAmount(e.target.value);
          }}
          value={inputAmount}
        />
        <button
          onClick={() => sendDepositTokenAsyncTxn?.()}
          className='col-span-1 h-12 rounded-xl bg-[#1867FD] font-semibold text-white'
        >
          Deposit
        </button>
      </div>
    ),
    Withdraw: (
      <div className='W-full grid grid-cols-4 gap-6'>
        <input
          placeholder={` Your Balance to Withdraw is: ${balanceETH} ETH`}
          type='number'
          className='col-span-3 h-12 rounded-xl bg-[#262229] focus:outline-none'
          onChange={(e) => {
            setWithdrawAmount(e.target.value);
          }}
          value={withdrawAmount}
        />
        <button
          onClick={() => sendWithdrawTokenAsyncTxn?.()}
          className='col-span-1 h-12 rounded-xl bg-[#1867FD] font-semibold text-white'
        >
          Withdraw
        </button>
      </div>
    ),
  };

  return (
    <Layout>
      <div className='m-auto max-w-[67rem] px-10 py-8'>
        <button
          onClick={() => router.push('/')}
          className='flex items-center gap-2 text-sm text-[#AFAEAE]'
        >
          <ArrowLeftIcon className='w-4' />
          Back
        </button>
        <div className='mt-8 flex items-center justify-between'>
          <div className='flex flex-col gap-2'>
            <div className='flex items-end gap-6'>
              <span className='text-3xl font-bold'>
                {balanceETH
                  ? parseFloat(balanceETH.toString()).toFixed(4)
                  : '-'}{' '}
                ETH
              </span>
              {/* <span className='text-lg font-medium'>
                ${' '}
                {data?.formatted
                  ? JSON.stringify(convertDollar(parseFloat(data?.formatted)))
                  : '-'}
              </span> */}
            </div>
            <div>
              <div className='text-[#AFAEAE]'>Your account balance</div>
              <div className='text-[#AFAEAE]'>
                Set low balance alerts (coming soon)
              </div>
            </div>
          </div>
          <div className='inline-flex items-center justify-center gap-2 rounded-xl border border-solid border-[#464646] px-4 py-2 font-medium'>
            <Image
              width={20}
              height={20}
              className='w-5 rounded-full'
              alt='Eth'
              src='/logo/chains/Goerli.png'
            />
            Ethereum
          </div>
        </div>
        <div className='mt-9'>
          <Tab.Group>
            <Tab.List className='flex w-[13rem] gap-[1px] space-x-1 rounded-xl bg-[#373A40] p-[5px]'>
              {Object.keys(panels).map((category, index) => (
                <Tab
                  key={index}
                  className={() =>
                    classNames(
                      'w-full rounded-xl py-2.5 text-sm font-medium leading-5 text-white',
                      selectedCategory === category
                        ? 'bg-[#1867FD] shadow'
                        : ' bg-[#292929] hover:text-white'
                    )
                  }
                  onClick={() => {
                    setSelectedCategory(category);
                  }}
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className='mt-6 '>
              {Object.values(panels).map((panel, idx) => (
                <Tab.Panel
                  key={idx}
                  // className={classNames('rounded-xl  bg-[#282828] p-5')}
                >
                  {panel}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
        <div className='mt-[7rem]'>
          <div className='flex items-center justify-between'>
            <div className='text-3xl font-bold'>History</div>
            <Tab.Group>
              <Tab.List className='flex w-[17rem] gap-[1px] space-x-1 rounded-xl bg-[#373A40] p-[5px]'>
                {['All', 'Deposits', 'Withdrawals'].map((category, index) => (
                  <Tab
                    key={index}
                    className={() =>
                      classNames(
                        'w-full rounded-xl px-4 py-2.5 text-sm font-medium leading-5 text-white',
                        selectedTableCategory === category
                          ? 'bg-[#1867FD] shadow'
                          : ' bg-[#292929]  hover:text-white'
                      )
                    }
                    onClick={() => {
                      setSelectedTableCategory(category);
                    }}
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>
          </div>
          <div className='mt-4 bg-[#272E3C] p-5'>
            {selectedTableCategory === 'All' && <AllTransactionTable />}
            {selectedTableCategory === 'Deposits' && (
              <DepositTransactionTable />
            )}
            {selectedTableCategory === 'Withdrawals' && (
              <WithdrawTransactionTable />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
