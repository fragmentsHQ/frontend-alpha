import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import * as React from 'react';
import { ImSpinner2 } from 'react-icons/im';
import { useNetwork } from 'wagmi';

import clsxm from '@/lib/clsxm';

import UnstyledLink from '@/components/links/UnstyledLink';

export interface Column {
  id: 'date' | 'transaction_hash' | 'status' | 'tx_amount' | 'gas_paid';
  label: string;
  minWidth?: number;
  align?: 'right';
}

export const columns: readonly Column[] = [
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'transaction_hash', label: 'Tx hash', minWidth: 100 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'tx_amount',
    label: 'Amount',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'gas_paid',
    label: 'Gas Paid',
    minWidth: 170,
    align: 'right',
  },
];

interface Data {
  id: string;
  date: string;
  transaction_hash: string;
  status: 'ongoing' | 'success' | 'failed';
  tx_amount: string;
  gas_paid: string;
}

export default function TransactionTable({
  fundsdata,
  loading,
}: {
  loading: boolean;
  fundsdata: {
    id: string;
    blockTimestamp: string;
    transactionHash: string;
    amount: string;
    token: { symbol: string };
  }[];
}) {
  const [page, setPage] = React.useState(0);
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

  const filteredData: Data[] = React.useMemo(() => {
    if (!fundsdata) {
      return [];
    }
    const sortedData: Data[] = fundsdata.map(
      (fund: {
        id: string;
        blockTimestamp: string;
        transactionHash: string;
        amount: string;
        token: { symbol: string };
      }) => {
        return {
          id: fund.id,
          date: fund.blockTimestamp,
          transaction_hash: fund.transactionHash,
          status: 'success',
          tx_amount: `${parseFloat(fund.amount) / Math.pow(10, 18)} ETH`,
          gas_paid: '0.0000000',
        };
      }
    );
    return sortedData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, fundsdata]);

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
            {!loading && fundsdata.length === 0 && (
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
                    <p className='mt-2'>No Deposits/withdrawals found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
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
                    <p className='mt-2'>Fetching data.....</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredData &&
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => <TransactionRow key={index} row={row} />)}
          </TableBody>
        </Table>
      </TableContainer>
      {fundsdata.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[2, 5, 10]}
          component='div'
          style={{
            color: '#fff',
            backgroundColor: '#262626',
          }}
          className='text-white'
          count={fundsdata.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TransactionRow = ({ row }: { row: any }) => {
  const { chain } = useNetwork();
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
            {column.id === 'date' && (
              <div>
                <span className='block text-[#AFAEAE]'>
                  <span className='text-white'>
                    {dayjs
                      .unix(parseInt(value as Data['date']))
                      .toDate()
                      .toDateString()}
                  </span>
                </span>
                <span
                  className='mt-1 block
           text-[#AFAEAE]'
                >
                  {dayjs
                    .unix(parseInt(value as Data['date']))
                    .toDate()
                    .toLocaleTimeString()}
                </span>
              </div>
            )}
            {column.id === 'transaction_hash' && (
              <div className='w-[200px] truncate'>{value as string}</div>
            )}
            {column.id === 'tx_amount' && (
              <div>
                <span className='block text-[#AFAEAE]'>
                  <span className='text-white'>
                    {value as Data['tx_amount']}
                  </span>
                </span>
              </div>
            )}
            {column.id === 'status' && (
              <UnstyledLink
                href='#'
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
              </UnstyledLink>
            )}
            {column.id === 'gas_paid' && (
              <UnstyledLink
                href='https://etherscan.io'
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {value as string}
              </UnstyledLink>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
