import { useQuery } from '@apollo/client';
import { Tab } from '@headlessui/react';
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/20/solid';
import {
  prepareSendTransaction,
  sendTransaction,
  waitForTransaction,
} from '@wagmi/core';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { encodeFunctionData } from 'viem';
import { useNetwork, useToken } from 'wagmi';

import useCheckIfValidJob from '@/hooks/useCheckIfValidJob';

import UnstyledLink from '@/components/links/UnstyledLink';
import TransactionTable from '@/components/table/TransactionTable';

import { AUTOPAY_CONTRACT_ADDRESSES, ZERO_ADDRESS } from '@/config/contracts';
import { TOKENS } from '@/config/tokens';
import { GetAJobDocument, GetAJobQuery } from '@/graphql/getAJob.generated';
import { GetExecutedSourceChainsDocument } from '@/graphql/getAllExecutedChainData.generated';
import { GelatoIcon } from '@/pages/job/[jobId]';
import { GoBackLink } from '@/pages/jobs';

import AutoPayAbi from '../../abi/Autopay.json';
import LoadingModal from '@/components/loading/Loader';
import LoadingScreen from '@/components/loaders';
import { TransactionState } from '@/hooks/useDepositBalance';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const JobTaskData = ({
  id,
  client,
}: {
  id: string;
  client: 'endpoint1' | 'endpoint2';
}) => {
  const { data, loading } = useQuery(GetAJobDocument, {
    variables: {
      id: id,
    },
    context: { clientName: client },
  });

  const { chain } = useNetwork();
  const [selectedTableCategory, setSelectedTableCategory] =
    useState('Executions');
  if (loading || !data) {
    return (
      <div className='flex h-[300px] w-full  flex-col items-center justify-center'>
        <ImSpinner2 className='animate-spin' size={30} />
        <p className='mt-4 text-[18px]'>Fetching Job Data.....</p>
      </div>
    );
  }

  return (
    <div className='mx-auto w-full max-w-5xl py-10'>
      <div className='flex items-center justify-between'>
        <GoBackLink />
        <CancelJob jobId={data?.jobCreated._jobId} />
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='flex gap-2'>
          <span>
            Created by:{' '}
            <UnstyledLink
              href={
                chain?.blockExplorers?.default.url +
                '/address/' +
                data?.jobCreated?._taskCreator
              }
              className='underline'
            >
              {data?.jobCreated?._taskCreator}
            </UnstyledLink>
          </span>
          <ArrowUpRightIcon className='w-4' />
          <span className='text-[#AFAEAE]'>
            {dayjs
              .unix(parseInt(data?.jobCreated._startTime))
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
              data?.jobCreated?.transactionHash
            }
            className='underline'
          >
            {data?.jobCreated._jobId}
          </UnstyledLink>
        </div>
      </div>
      {data.jobCreated._jobId && (
        <ExecutionData
          jobId={data.jobCreated._jobId}
          isForwardPayingGas={data.jobCreated._isForwardPaying}
          client={client}
        />
      )}
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
                data?.jobCreated._destinationContract
              }
              className='mr-2 underline'
            >
              {data?.jobCreated._destinationContract}
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
          <span className='text-lg font-semibold text-[#AFAEAE]'>Trigger</span>
          <div className='flex'>{data?.jobCreated._interval}</div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>
            Trigger value
          </span>
          <div className='flex'>
            One{' '}
            {data?.jobCreated._interval === 86400
              ? 'days'
              : data?.jobCreated._interval === 2629800
              ? 'months'
              : data?.jobCreated._interval === 604800
              ? 'weeks'
              : data?.jobCreated._interval === 31536000
              ? 'years'
              : null}
            time
          </div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>
            Start time
          </span>
          <div className='flex'>
            {dayjs
              .unix(parseInt(data?.jobCreated._startTime))
              .toDate()
              .toLocaleString()}
          </div>
        </div>
        <div className='flex items-center gap-7'>
          <span className='text-lg font-semibold text-[#AFAEAE]'>End time</span>
          <div className='flex'>
            {dayjs
              .unix(parseInt(data?.jobCreated._startTime))
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
          {selectedTableCategory === 'Executions' && data.jobCreated._jobId ? (
            <TransactionTable jobId={data.jobCreated._jobId} client={client} />
          ) : (
            <div className='flex h-[300px] items-center justify-center'>
              <a
                href={`https://beta.app.gelato.network/task/${data?.jobCreated?._gelatoTaskId}?chainId=${chain?.id}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex cursor-pointer items-center justify-center rounded-lg bg-[#1867FD] px-4 py-3'
              >
                <span className='mr-2 text-[20px] font-bold'>View logs on</span>{' '}
                <GelatoIcon />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTaskData;

export const TaskData = ({ job }: { job: GetAJobQuery['jobCreated'] }) => {
  const { chain } = useNetwork();
  const { data: fromToken } = useToken({
    address: job.jobCreated._fromToken,
    chainId: chain?.id,
  });
  const toToken = TOKENS[job.jobCreated._toChain as number].filter((e) => {
    return e.address.toLowerCase() === job.jobCreated._toToken.toLowerCase();
  })[0];

  return (
    <div className='mt-8 flex h-[10rem] w-full rounded-lg border border-solid border-[#AFAEAE] bg-[#262229]'>
      <div className='flex w-[48.5%] flex-col justify-start space-y-4 rounded-lg bg-[#262229] p-5'>
        <div className='flex flex-col'>
          <span className='text-[#AFAEAE]'>Spender Address</span>
          <span className='flex gap-2'>
            {job.jobCreated._taskCreator} <ArrowUpRightIcon className='w-4' />
          </span>
        </div>
        <div className='flex justify-start space-x-12'>
          <div className='flex flex-col'>
            <span className='text-[#AFAEAE]'>Token Sent</span>
            {/* <span>{job.jobCreateds[0]._fromToken}</span> */}
            <span>{fromToken?.symbol}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-[#AFAEAE]'>Amount</span>
            {job?.jobCreated._amount /
              Math.pow(10, fromToken?.decimals as number)}
          </div>
          <div className='flex flex-col'>
            <span className='text-[#AFAEAE]'>Chain</span>
            <span>{chain?.id}</span>
          </div>
        </div>
      </div>
      <div className='flex w-[3%] items-center justify-center bg-[#3c3c3c]'>
        <ArrowRightIcon className='w-5' />
      </div>
      <div className='flex w-[48.5%] flex-col justify-start space-y-4 rounded-lg bg-black p-5'>
        <div className='flex flex-col'>
          <span className='text-[#AFAEAE]'>Receiver Address</span>
          <span className='flex gap-2'>
            {job.jobCreated._to} <ArrowUpRightIcon className='w-4' />
          </span>
        </div>
        <div className='flex justify-start space-x-12'>
          <div className='flex flex-col'>
            <span className='text-[#AFAEAE]'>Token&nbsp;Received</span>
            <span>{toToken?.symbol}</span>
          </div>
          <div className='flex flex-col'>
            <span className='text-[#AFAEAE]'>Amount</span>
            {parseInt(job.jobCreated._toChain) !== chain?.id
              ? '-'
              : job?.jobCreated._amount /
                Math.pow(10, toToken?.decimals as number)}
          </div>
          <div className='flex flex-col'>
            <span className='text-[#AFAEAE]'>Chain</span>
            <span>{job.jobCreated._toChain}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CancelJob = ({ jobId }: { jobId: string }) => {
  const [transactionState, setTransactionState] =
    useState<TransactionState | null>(null);
  const { chain } = useNetwork();
  const { data } = useCheckIfValidJob({
    job_id: jobId,
  });

  if (data?.isCancellable) {
    return null;
  }

  const cancelJob = async () => {
    try {
      setTransactionState(TransactionState.PROCESSING);
      const args = [jobId];
      const callDataCreateTimeTxn = encodeFunctionData({
        abi: AutoPayAbi.abi,
        functionName: '_cancelJob',
        args: args,
      });

      const request = await prepareSendTransaction({
        to: chain
          ? AUTOPAY_CONTRACT_ADDRESSES[
              chain?.testnet ? 'testnets' : 'mainnets'
            ][chain?.id]
          : ZERO_ADDRESS,
        data: callDataCreateTimeTxn,
        value: BigInt(0),
      });
      const { hash } = await sendTransaction(request);
      const res = await waitForTransaction({
        hash,
      });
      setTransactionState(TransactionState.SUCCESS);
      return { hash: res.transactionHash };
    } catch (error) {
      setTransactionState(TransactionState.FAILED);
      return { hash: null };
    }
  };
  return (
    <div>
      <LoadingScreen
        handleClose={() => setTransactionState(null)}
        isTransactionFailed={transactionState === TransactionState.FAILED}
        isTransactionProcessing={
          transactionState === TransactionState.PROCESSING
        }
        isTransactionSuccessFul={transactionState === TransactionState.SUCCESS}
        isApproving={false}
        showJobSection={false}
        hash=''
      />
      <button
        onClick={() => {
          cancelJob();
        }}
        className='rounded-xl bg-[#1867FD] px-5 py-2'
      >
        Cancel job
      </button>
    </div>
  );
};

const ExecutionData = ({
  jobId,
  isForwardPayingGas,
  client,
}: {
  jobId: string;
  isForwardPayingGas: boolean;
  client: 'endpoint1' | 'endpoint2';
}) => {
  const { data: executionData } = useQuery(GetExecutedSourceChainsDocument, {
    variables: {
      where: {
        _jobId: jobId,
      },
    },
    context: { clientName: client },
  });

  const { data } = useCheckIfValidJob({
    job_id: jobId,
  });

  const { chain } = useNetwork();
  if (executionData && executionData.executedSourceChains.length === 0)
    return null;

  const costs = executionData?.executedSourceChains.reduce((acc, curr) => {
    return parseFloat(acc) + parseFloat(curr._fundsUsed);
  }, 0);

  console.log(costs);
  return (
    <div className='mt-8 flex justify-between'>
      <div className='flex justify-center gap-8'>
        <div className='flex flex-col justify-center'>
          <span className='text-2xl font-bold'>
            {chain && costs} {chain?.nativeCurrency.symbol}
          </span>
          <span className='text-[#AFAEAE]'>Cost</span>
        </div>
        <div className='flex flex-col justify-center'>
          <span className='text-2xl font-bold'>
            {parseInt(data?.execution) + 1}
          </span>
          <span className='text-[#AFAEAE]'>Executions</span>
        </div>
      </div>
      <div className='flex flex-col gap-[0.3rem] rounded-lg bg-[#282828] p-4'>
        <span className='ml-auto text-2xl font-bold'>{costs}</span>
        <span className='ml-auto text-[#AFAEAE]'>Gas Paid</span>
        {isForwardPayingGas && (
          <span className='ml-auto rounded-[4.5rem] bg-[#393939] p-2 px-3 text-xs'>
            Forward paying gas
          </span>
        )}
      </div>
    </div>
  );
};
