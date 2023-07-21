import { useQuery } from '@apollo/client';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { useNetwork, useToken } from 'wagmi';

import clsxm from '@/lib/clsxm';
import useGetCrossChainData from '@/hooks/useGetCrossChainData';

import UnstyledLink from '@/components/links/UnstyledLink';

import { GetAJobDocument } from '@/graphql/getAJob.generated';
import { GetExecutedSourceChainsDocument } from '@/graphql/getAllExecutedChainData.generated';

import { LinkIcon } from '../../components/chains_tasks/GoerliJobs';

interface Column {
  id: 'transaction_hash' | 'transaction' | 'destination_transaction' | 'status';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'transaction_hash', label: 'Source Transaction Hash', minWidth: 170 },
  { id: 'transaction', label: 'Source Transaction', minWidth: 100 },
  {
    id: 'destination_transaction',
    label: 'Destination Transaction',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: 'right',
  },
];

interface Data {
  id: string;
  transaction_hash: {
    address: string;
    date: string;
  };
  transaction: { token: string; chain: string };
  destination_transaction: { token: string; chain: string };
  status: 'ongoing' | 'success' | 'failed';
}

const rows: Data[] = [
  {
    id: '1',
    transaction_hash: {
      address: '0xf8c929db...04f21d9b',
      date: 'May 27, 2023, 24:12',
    },
    transaction: {
      token: '0.245 ETH',
      chain: 'Goerli',
    },
    destination_transaction: {
      token: '0.245 ETH',
      chain: 'Optimism',
    },
    status: 'success',
  },
];

export default function TransactionTable({ jobId }: { jobId: string }) {
  const [page, setPage] = React.useState(0);
  const { data: executionData, loading: isExecutionDataLoading } = useQuery(
    GetExecutedSourceChainsDocument,
    {
      variables: {
        where: {
          _jobId: jobId,
        },
      },
      context: { clientName: 'endpoint1' },
    }
  );

  const filteredData: Data[] = React.useMemo(() => {
    if (!executionData) {
      return [];
    }
    const sortedData: Data[] = executionData.executedSourceChains.map(
      (execution) => {
        return {
          id: '1',
          transaction_hash: {
            address: execution.transactionHash,
            date: dayjs
              .unix(parseInt(execution.blockTimestamp))
              .toDate()
              .toLocaleString(),
          },
          transaction: {
            token: '0.245 ETH',
            chain: 'Goerli',
          },
          destination_transaction: {
            token: '0.245 ETH',
            chain: 'Optimism',
          },
          status: 'success',
        };
      }
    );
    return sortedData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExecutionDataLoading, executionData]);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const router = useRouter();
  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#373A40',
        color: '#fff',
        fontFamily: 'Inter',
        boxShadow: 'none',
      }}
    >
      <TableContainer className='bg-transparent' sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    color: '#ffff',
                    borderColor: '#373A40',
                    backgroundColor: '#373A40',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isExecutionDataLoading &&
              executionData.executedSourceChains.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    style={{
                      backgroundColor: '#262229',
                    }}
                  >
                    <div
                      className='flex h-[300px] w-full flex-col items-center 
                   justify-center text-white '
                    >
                      <p className='mt-2'>No executions found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            {isExecutionDataLoading && (
              <TableRow>
                <TableCell
                  colSpan={12}
                  style={{
                    backgroundColor: '#373A40',
                  }}
                >
                  <div
                    className='flex h-[300px] w-full flex-col items-center 
                   justify-center text-white '
                  >
                    <ImSpinner2 className='animate-spin' size={20} />
                    <p className='mt-2'>Fetching data.....</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return <TransactionRow key={index} row={row} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {executionData && executionData.executedSourceChains.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[2, 5, 10]}
          component='div'
          style={{
            color: '#fff',
            backgroundColor: '#262626',
          }}
          className='text-white'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

const TransactionRow = ({ row }: { row: any }) => {
  const router = useRouter();
  const id = router.query.jobId;
  const { data } = useQuery(GetAJobDocument, {
    variables: {
      id: id,
    },
    context: { clientName: 'endpoint1' },
  });
  console.log();
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        const value = row[column.id];
        return (
          <TableCell
            key={column.id}
            align={column.align}
            style={{
              cursor: 'pointer',
              color: '#fff',
              backgroundColor: '#262229',
              borderColor: '#262229',
            }}
          >
            {column.id === 'transaction_hash' && (
              <div>
                <div className='w-[200px] truncate'>
                  {(value as Data['transaction_hash']).address}
                </div>
                <span
                  className='mt-1 block
           text-[#AFAEAE]'
                >
                  {(value as Data['transaction_hash']).date}
                </span>
              </div>
            )}
            {column.id === 'transaction' && data.jobCreated && (
              <Sender job={data.jobCreated} />
            )}
            {column.id === 'destination_transaction' &&
              row.transaction_hash.address && (
                <Receiver
                  job={data.jobCreated}
                  executedTxnHash={row.transaction_hash.address}
                />
              )}
            {column.id === 'status' && (
              <UnstyledLink
                href='https://etherscan.io'
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={clsxm(
                  ' flex items-center justify-end',
                  'capitalize',
                  value === 'ongoing' && 'text-[#1867FD]',
                  value === 'success' && 'text-[#00C1A3]'
                )}
              >
                {value as string}
                <LinkIcon />
              </UnstyledLink>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

const Sender = ({ job }: { job: any }) => {
  const { chain } = useNetwork();
  const { data: fromToken } = useToken({
    address: job._fromToken as string,
  });

  return (
    <div>
      <span className='block text-[#AFAEAE]'>
        Token :{' '}
        <span className='text-white'>
          {job._amount / Math.pow(10, fromToken?.decimals)}&nbsp;
          {fromToken && fromToken.name}
        </span>
      </span>
      <span
        className='mt-1 block
text-[#AFAEAE]'
      >
        Chain : <span className='text-white'>{chain?.name}</span>
      </span>
    </div>
  );
};

const Receiver = ({
  job,
  executedTxnHash,
}: {
  job: any;
  executedTxnHash: string;
}) => {
  const { chain } = useNetwork();
  const { data: fromToken } = useToken({
    address: job._toToken as string,
  });

  if (parseInt(job._toChain) === chain?.id) {
    return (
      <div>
        <span className='block text-[#AFAEAE]'>
          Token :{' '}
          <span className='text-white'>
            {job._amount / Math.pow(10, fromToken?.decimals)}&nbsp;
            {fromToken && fromToken.name}
          </span>
        </span>
        <span
          className='mt-1 block
text-[#AFAEAE]'
        >
          Chain : <span className='text-white'>{chain?.name}</span>
        </span>
      </div>
    );
  }

  if (parseInt(job._toChain) !== chain?.id && executedTxnHash) {
    return <CrossChain executedTxnHash={executedTxnHash} chainId={chain?.id} />;
  }

  return null;
};

export const CrossChain = ({
  chainId,
  executedTxnHash,
}: {
  chainId: string;
  executedTxnHash: string;
}) => {
  const { amount } = useGetCrossChainData({
    chainId: parseInt(chainId),
    transactionHash: executedTxnHash,
  });

  if (!amount) return null;

  return (
    <div>
      <span className='block text-[#AFAEAE]'>
        Token :{' '}
        <span className='text-white'>
          {data.amount}&nbsp;
          {data.token}
        </span>
      </span>
      <span
        className='mt-1 block
text-[#AFAEAE]'
      >
        Chain : <span className='text-white'>{data.chain}</span>
      </span>
    </div>
  );
};
