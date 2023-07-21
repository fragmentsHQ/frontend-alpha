import { useQuery } from '@apollo/client';
import { Tab } from '@headlessui/react';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { useAccount, useNetwork } from 'wagmi';

import { TaskData } from '@/components/chains_tasks/GoerliTasks';
import UnstyledLink from '@/components/links/UnstyledLink';
import TransactionTable from '@/components/table/TransactionTable';

import { AUTOPAY_CONTRACT_ADDRESSES } from '@/config/contracts';
import { GetAllJobsDocument } from '@/graphql/alljobs.generated';
import { GelatoIcon } from '@/pages/job/[jobId]';
import { GoBackLink } from '@/pages/jobs';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const PolygonTasks = ({ jobId }: { jobId: string }) => {
  const { address } = useAccount();
  const { data, loading } = useQuery(GetAllJobsDocument, {
    variables: {
      where: {
        _taskCreator: address,
        id: jobId,
      },
    },
    context: { clientName: 'endpoint2' },
  });

  const { chain } = useNetwork();
  const [selectedTableCategory, setSelectedTableCategory] =
    useState('Executions');
  // const [dataRows, setDataRows] = useState([
  //   {
  //     id: '0',
  //     sourceTxnHash: {
  //       hash: '0xf8c929db...04f21d9b',
  //       date: 'May 27, 2023, 24:12',
  //     },
  //     sourceTxn: { token: '0.0245 ETH', chain: 'Arbitrum' },
  //     destinationTxn: { token: '0.0241 ETH', chain: 'Optimism' },
  //     status: 'success',
  //   },
  // ]);

  // const fetchPrevTransactions = async () => {
  //   try {
  //     if (!chain) return;
  //     const conditionalContract = CONDITIONAL_CONTRACT(chain);
  //     const autoPaycontract = AUTOPAY_CONTRACT(chain);

  //     let filter = conditionalContract.filters.JobCreated(
  //       null,
  //       address,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null
  //     );

  //     let events = await conditionalContract.queryFilter(filter);

  //     let data = events.map((event) => {
  //       // const { token, amount } = event.args;

  //       return {
  //         id: event.args?.taskId.toString(),
  //         sourceTxnHash: {
  //           hash: event.transactionHash,
  //           date: 'May 27, 2023, 24:12',
  //         },
  //         sourceTxn: { token: '0.0245 ETH', chain: 'Arbitrum' },
  //         destinationTxn: { token: '0.0241 ETH', chain: 'Optimism' },
  //         status: 'success',
  //       };
  //     });

  //     setDataRows(data);

  //     filter = autoPaycontract.filters.JobCreated(
  //       null,
  //       address,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null,
  //       null
  //     );

  //     events = await conditionalContract.queryFilter(filter);

  //     console.log('*** DEBUG', events);

  //     data = events.map((event) => {
  //       // const { token, amount } = event.args;

  //       return {
  //         id: event.args?.taskId.toString(),
  //         sourceTxnHash: {
  //           hash: event.transactionHash,
  //           date: 'May 27, 2023, 24:12',
  //         },
  //         sourceTxn: { token: '0.0245 ETH', chain: 'Arbitrum' },
  //         destinationTxn: { token: '0.0241 ETH', chain: 'Optimism' },
  //         status: 'success',
  //       };
  //     });

  //     setDataRows([...dataRows, data]);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  `  // useEffect(() => {
  //   if (address) {
  //     fetchPrevTransactions();
  //   }
  // }, [address]);`;

  if (loading) {
    return (
      <div className='flex h-[300px] w-full  flex-col items-center justify-center'>
        <ImSpinner2 className='animate-spin' size={30} />
        <p className='mt-4 text-[18px]'>Fetching Job Data.....</p>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-5xl py-10'>
      <GoBackLink />
      <div className='mt-8 flex flex-col'>
        <div className='flex gap-2'>
          <span>
            Created by:{' '}
            <UnstyledLink
              href={
                chain?.blockExplorers?.default.url +
                '/address/' +
                data?.jobCreateds[0]?._taskCreator
              }
              className='underline'
            >
              {data?.jobCreateds[0]?._taskCreator}
            </UnstyledLink>
          </span>
          <ArrowUpRightIcon className='w-4' />
          <span className='text-[#AFAEAE]'>
            {dayjs
              .unix(parseInt(data?.jobCreateds[0]._startTime))
              .toDate()
              .toLocaleString()}
          </span>
        </div>
        <div className='mt-2 text-[#AFAEAE]'>
          Task ID:&nbsp;
          <UnstyledLink
            href={
              chain?.blockExplorers?.default.url +
              '/tx/' +
              data?.jobCreateds[0]?.transactionHash
            }
            className='underline'
          >
            {data?.jobCreateds[0].transactionHash}
          </UnstyledLink>
        </div>
      </div>
      <div className='mt-8 flex justify-between'>
        <div className='flex justify-center gap-8'>
          <div className='flex flex-col justify-center'>
            <span className='text-2xl font-bold'>$ 364.26</span>
            <span className='text-[#AFAEAE]'>Cost</span>
          </div>
          <div className='flex flex-col justify-center'>
            <span className='text-2xl font-bold'>2314</span>
            <span className='text-[#AFAEAE]'>Executions</span>
          </div>
        </div>
        <div className='flex flex-col gap-[0.3rem] rounded-lg bg-[#282828] p-4'>
          <span className='ml-auto text-2xl font-bold'>$ 364.26</span>
          <span className='ml-auto text-[#AFAEAE]'>Gas Paid</span>
          <span className='ml-auto rounded-[4.5rem] bg-[#393939] p-2 px-3 text-xs'>
            Forward paying gas
          </span>
        </div>
      </div>
      {data ? <TaskData job={data} /> : null}
      <div className='mt-8 flex flex-col gap-4 rounded-lg bg-[#262229] p-5 px-7'>
        <div className='flex items-center justify-between'>
          <span className='text-3xl font-bold text-[#AFAEAE]'>Execute</span>
          <span className='rounded-xl bg-[#1867FD] px-5 py-2'>Time</span>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>
            Destination Contract
          </span>
          <div className='flex'>
            <UnstyledLink
              href={
                chain?.blockExplorers?.default.url +
                '/address/' +
                data?.jobCreateds[0]?._destinationContract
              }
              className='mr-2 underline'
            >
              {data?.jobCreateds[0]?._destinationContract}
            </UnstyledLink>
            <ArrowUpRightIcon className='w-5' />
          </div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>
            Source Contract
          </span>
          <div className='flex'>
            <UnstyledLink
              href={
                chain?.blockExplorers?.default.url +
                '/address/' +
                AUTOPAY_CONTRACT_ADDRESSES.testnets[chain?.id as number]
              }
              className='mr-2 underline'
            >
              {AUTOPAY_CONTRACT_ADDRESSES.testnets[chain?.id as number]}
            </UnstyledLink>
            <ArrowUpRightIcon className='w-5' />
          </div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>
            Automation Type
          </span>
          <div className='flex'>Autopay</div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>Amount</span>
          <div className='flex'>Autopay</div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>Trigger</span>
          <div className='flex'>{data?.jobCreateds[0]._interval}</div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>
            Trigger value
          </span>
          <div className='flex'>
            Every {data?.jobCreateds[0]._interval} time
          </div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>
            Start time
          </span>
          <div className='flex'>
            {dayjs
              .unix(parseInt(data?.jobCreateds[0]._startTime))
              .toDate()
              .toLocaleString()}
          </div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>End time</span>
          <div className='flex'>
            {dayjs
              .unix(parseInt(data?.jobCreateds[0]._startTime))
              .toDate()
              .toLocaleString()}
          </div>
        </div>
      </div>
      <div className='mt-14'>
        <div className='flex items-center justify-start'>
          <Tab.Group>
            <Tab.List className='flex w-[17rem] gap-[1px] space-x-1 rounded-xl bg-[#373A40] p-[5px]'>
              {['Executions', 'Task Logs'].map((category) => (
                <Tab
                  key={category}
                  className={() =>
                    classNames(
                      'w-full rounded-xl px-4 py-2.5 text-sm font-medium leading-5 text-white',
                      selectedTableCategory === category
                        ? 'bg-[#1867FD] shadow'
                        : ' hover:bg-white/[0.12] hover:text-white'
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
        <div className='mt-4 rounded-[10px] bg-[#272E3C] p-5'>
          {selectedTableCategory === 'Executions' ? (
            <TransactionTable />
          ) : (
            <div>
              <GelatoIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolygonTasks;
