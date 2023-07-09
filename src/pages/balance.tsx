import { Tab } from '@headlessui/react';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Button } from '@mui/material';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
} from 'wagmi';

import { useAutoConnect } from '@/hooks/useAutoConnect';

import Layout from '@/components/layout/Layout';
import TransactionTable from '@/components/table/TransactionTable';

import {
  ETH,
  TREASURY_CONTRACT,
  TREASURY_CONTRACT_ADDRESSES,
  ZERO_ADDRESS,
} from '@/config/contracts';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const headers = [
  {
    key: 'date',
    header: 'Date',
  },
  {
    key: 'txnHash',
    header: 'Txn Hash',
  },
  {
    key: 'status',
    header: 'Status',
  },
  {
    key: 'txnAmount',
    header: 'Txn Amount',
  },
  {
    key: 'gasPaid',
    header: 'Gas Paid',
  },
];

const getEclipsedText = (text: string) => {
  return text.slice(0, 6) + '.....' + text.slice(text.length - 6, text.length);
};

const Profile = () => {
  useAutoConnect();
  // useAutoConnect();

  const router = useRouter();

  const { chain } = useNetwork();
  // const { address } = getAccount();
  // const provider = getProvider();
  const { address } = useAccount();
  const provider = ethers.getDefaultProvider();
  const [selectedCategory, setSelectedCategory] = useState('Deposit');
  const [selectedTableCategory, setSelectedTableCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [inputAmount, setInputAmount] = useState(0);
  const [balanceEth, setBalanceEth] = useState(0);
  const [balanceDollar, setBalanceDollar] = useState(0);

  const [dataRows, setDataRows] = useState([
    {
      id: '0',
      date: 'May 27, 2023, 24:12',
      txnHash: '0x0F5D2........68908cC942',
      status: 'Success',
      txnAmount: '0.00055 ETH',
      gasPaid: '0.00005 ETH ',
    },
  ]);

  const [callDataDeposit, setCallDataDeposit] = useState('');
  const [callDataWithdraw, setCallDataWithdraw] = useState('');

  const fetchPrevTransactions = async () => {
    try {
      if (!chain) return;

      const contract = TREASURY_CONTRACT(chain);

      const filter = contract.filters.FundsDeposited(address, null, null);

      const events = await contract.queryFilter(filter);

      console.log('*** DEBUG', events);

      const rows = events.map((event) => {
        return {
          id: event.transactionHash,
          date: event.args ? event.args.token.toLocaleString() : '',
          txnHash: event.transactionHash,
          status: 'Success',
          txnAmount: event.args ? `${event.args.amount.toString()} ETH` : '',
          gasPaid: '0.00005 ETH ',
        };
      });
      setDataRows(rows);
    } catch (err) {
      console.error(err);
    }
  };

  const convertDollar = async (priceInETH: number) => {
    try {
      const amount = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const amountJson = await amount.json();
      const amountInDollar = amountJson.ethereum.usd;

      console.log(convertDollar);

      setBalanceDollar(priceInETH * amountInDollar);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBalance = async () => {
    try {
      if (!chain) return;

      const contract = TREASURY_CONTRACT(chain);

      const checkBalance = await contract.userTokenBalance(address, ETH);

      const allowance = checkBalance.toString();
      console.log('***', allowance);

      setBalanceEth(allowance);
    } catch (err) {
      console.error(err);
    }
  };

  const { config: configWithdraw } = usePrepareSendTransaction({
    request: {
      to: chain
        ? TREASURY_CONTRACT_ADDRESSES[chain?.testnet ? 'testnets' : 'mainnets'][
            chain?.network
          ]
        : ZERO_ADDRESS,
      data: callDataDeposit,
    },
  });

  const { sendTransactionAsync: sendWithdrawTokenAsyncTxn } =
    useSendTransaction(configWithdraw);

  const { config: configDeposit } = usePrepareSendTransaction({
    request: {
      to: chain
        ? TREASURY_CONTRACT_ADDRESSES[chain?.testnet ? 'testnets' : 'mainnets'][
            chain?.network
          ]
        : ZERO_ADDRESS,
      data: callDataDeposit,
    },
  });

  const { sendTransactionAsync: sendDepositTokenAsyncTxn } =
    useSendTransaction(configDeposit);

  const handleUpdateDeposit = async () => {
    if (!chain) return;
    const TreasuryContract = TREASURY_CONTRACT(chain);

    setCallDataDeposit(
      TreasuryContract.interface.encodeFunctionData('depositFunds', [
        address,
        ETH,
        parseEther(inputAmount.toString()),
      ])
    );
  };

  const handleUpdateWithdraw = async () => {
    if (!chain) return;
    const TreasuryContract = TREASURY_CONTRACT(chain);

    setCallDataWithdraw(
      TreasuryContract.interface.encodeFunctionData('withdrawFunds', [
        address,
        ETH,
        parseEther(inputAmount.toString()),
      ])
    );
  };

  useEffect(() => {
    if (address) {
      handleUpdateDeposit();
      handleUpdateWithdraw();
    }
  }, [inputAmount]);
  useEffect(() => {
    if (address) {
      fetchBalance();
      fetchPrevTransactions();
    }
  }, [address]);

  const panels = {
    Deposit: (
      <div className='W-full grid grid-cols-4 gap-6'>
        <input
          placeholder='0.0'
          type='number'
          className='col-span-3 h-12 rounded-xl bg-[#262229] focus:outline-none'
          onChange={(e) => {
            setInputAmount(Number(e.target.value));
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
        <div className='col-span-3 flex h-12 items-center justify-center rounded-xl bg-[#262229]'>
          Your Balance to Withdraw is: $69.420
        </div>
        <Button
          onClick={() => sendWithdrawTokenAsyncTxn?.()}
          className='col-span-1 h-12 rounded-xl bg-[#1867FD] font-semibold text-white'
        >
          Withdraw
        </Button>
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
              <span className='text-3xl font-bold'>{balanceEth} ETH</span>
              <span className='text-lg font-medium'>$ {balanceDollar}</span>
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
              src={`/logo/chains/${chain?.network}.png`}
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
                  className={({ selected }) =>
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
                    className={({ selected }) =>
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
            {/* <DataTable
              rows={dataRows.slice(
                (currentPage - 1) * pageSize,
                (currentPage - 1) * pageSize + pageSize
              )}
              headers={headers}
            >
              {({
                rows,
                headers,
                getTableProps,
                getHeaderProps,
                getRowProps,
              }) => (
                <Table className='overflow-visible' {...getTableProps()}>
                  <TableHead align='center'>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHeader
                          key={index}
                          {...getHeaderProps({ header })}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, rowIdx) => (
                      <TableRow {...getRowProps({ row })} key={rowIdx}>
                        {(() => {
                          return row.cells.map((cell, index) => {
                            return (
                              <TableCell key={index}>
                                {cell.id.includes('date') ? (
                                  <div className='text-[#AFAEAE]'>
                                    {getEclipsedText(cell.value)}
                                  </div>
                                ) : cell.id.includes('txnHash') ? (
                                  <div>{getEclipsedText(cell.value)}</div>
                                ) : cell.id.includes('status') ? (
                                  <div className='text-[#00FFA9]'>
                                    {cell.value}
                                  </div>
                                ) : cell.id.includes('txnAmount') ? (
                                  <div>{cell.value}</div>
                                ) : cell.id.includes('gasPaid') ? (
                                  <div>{cell.value}</div>
                                ) : null}
                              </TableCell>
                            );
                          });
                        })()}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DataTable>
            <Pagination
              backwardText='Previous page'
              forwardText='Next page'
              itemsPerPageText='Items per page:'
              onChange={(e) => {
                setPageSize(e.pageSize);
                setCurrentPage(e.page);
              }}
              page={currentPage}
              pageSize={pageSize}
              pageSizes={[10, 20, 30, 40, 50]}
              totalItems={dataRows.length}
              // className="w-full"
            /> */}
            <TransactionTable />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
