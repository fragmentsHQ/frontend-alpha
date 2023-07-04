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
import { useAccount, useNetwork } from 'wagmi';

import clsxm from '@/lib/clsxm';
import useGetGasUsed from '@/hooks/useGetGasUsed';

import UnstyledLink from '@/components/links/UnstyledLink';

import {
  JobCreated_OrderBy,
  OrderDirection,
  useGetAllJobsQuery,
} from '@/graphql/types_polygon.generated';

interface Column {
  id: 'job_id' | 'owner' | 'total_fee_execution' | 'status';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'job_id', label: 'Job Id', minWidth: 170 },
  { id: 'owner', label: 'Owner', minWidth: 100 },
  {
    id: 'total_fee_execution',
    label: 'Total Fee & Executions',
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
  job_id: { address: string; date: string };
  owner: string;
  transactionHash: string;
  total_fee_execution: { total_fee: string; execution: string };
  status: 'ongoing' | 'completed' | 'failed';
}

export default function PolygonJobsTable() {
  const { address } = useAccount();
  const { data, loading } = useGetAllJobsQuery({
    variables: {
      where: {
        _taskCreator: address,
      },
      orderBy: JobCreated_OrderBy.BlockTimestamp,
      orderDirection: OrderDirection.Desc,
    },
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredData: Data[] = React.useMemo(() => {
    if (loading || !data) {
      return [];
    }
    const sortedData: Data[] = data.jobCreateds.map((job) => {
      return {
        id: job.id,
        job_id: { address: job._jobId, date: job._startTime },
        owner: job._taskCreator,
        status: 'completed',
        transactionHash: job.transactionHash,
        total_fee_execution: { execution: '', total_fee: '' },
      };
    });
    return sortedData;
  }, [loading, data]);
  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
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
                    maxWidth: 240,
                    overflow: 'hidden',
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
            {loading && (
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
                    <p className='mt-2'>Fetching Jobs.....</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredData &&
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => <JobRow row={row} key={index} />)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2, 5]}
        component='div'
        style={{
          color: '#fff',
          backgroundColor: '#262626',
        }}
        count={data?.jobCreateds.length || 30}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export const LinkIcon = () => {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M5.25 12.75L12.75 5.25'
        stroke='#AFAEAE'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M5.25 5.25H12.75V12.75'
        stroke='#AFAEAE'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
};

const JobRow = ({ row }: { row: Data }) => {
  const router = useRouter();
  const { chain } = useNetwork();
  const gas = useGetGasUsed({
    hash: row.transactionHash,
  });

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        const value = row[column.id];
        return (
          <TableCell
            key={column.id}
            align={column.align}
            onClick={() => {
              const path = '/job/' + row.id;
              router.push(path);
            }}
            style={{
              cursor: 'pointer',
              color: '#fff',
              backgroundColor: '#262229',
              borderColor: '#262229',
            }}
          >
            {column.id === 'owner' && (
              <div className='w-[200px] truncate'>{value as string}</div>
            )}
            {column.id === 'job_id' && (
              <div className=''>
                <span className='block w-[200px] truncate'>
                  {(value as Data['job_id']).address}
                </span>
                <span
                  className='block
                text-[#AFAEAE]'
                >
                  {dayjs
                    .unix(parseInt((value as Data['job_id']).date))
                    .toDate()
                    .toLocaleString()}
                </span>
              </div>
            )}
            {column.id === 'total_fee_execution' && (
              <div>
                <span className='block text-[#AFAEAE]'>
                  Total Fee : <span className='text-white'>{gas} Gwei</span>
                </span>
                <span
                  className='mt-1 block
                text-[#AFAEAE]'
                >
                  Execution :{' '}
                  <span className='text-white'>
                    {(value as Data['total_fee_execution']).execution}
                  </span>
                </span>
              </div>
            )}
            {column.id === 'status' && (
              <UnstyledLink
                href={
                  chain?.blockExplorers?.default.url +
                  '/tx/' +
                  row.transactionHash
                }
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={clsxm(
                  'block flex items-center justify-end',
                  'capitalize',
                  value === 'ongoing' && 'text-[#1867FD]',
                  value === 'completed' && 'text-[#00C1A3]'
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
