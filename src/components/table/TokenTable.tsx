import { ArrowUpCircleIcon, CheckIcon } from '@heroicons/react/20/solid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useCSVReader } from 'react-papaparse';
import useGlobalStore from 'store';

import clsxm from '@/lib/clsxm';

import ChainMenu, { TokenMenu } from '@/components/menu/ChainMenu';

interface Column {
  id:
    | 'to_address'
    | 'destination_token'
    | 'destination_chain'
    | 'amount_of_source_token';
  label: string;
  minWidth?: number;
  align?: 'right';
}

const columns: readonly Column[] = [
  { id: 'to_address', label: 'To Address', minWidth: 170 },
  {
    id: 'destination_chain',
    label: 'Destination chain',
    minWidth: 170,
  },
  { id: 'destination_token', label: 'Destination Token', minWidth: 100 },

  {
    id: 'amount_of_source_token',
    label: 'Amount of source token',
    minWidth: 170,
    align: 'right',
  },
];

export default function TokenTable() {
  const { CSVReader } = useCSVReader();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { enteredRows, setEnteredRows } = useGlobalStore();
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className='mt-4 rounded-[10px] bg-[#272E3C] px-4 py-6'>
      <CSVReader
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUploadAccepted={(results: any) => {
          setEnteredRows(
            results.data
              .slice(1)
              .map((elem: number[] | string[], idx: number) => {
                return {
                  id: String(idx),
                  to_address: elem[2],
                  destination_chain: parseInt(elem[0] as string),
                  destination_token: elem[1],
                  amount_of_source_token: elem[3],
                };
              })
          );
        }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {({ getRootProps, acceptedFile }: any) => (
          <>
            <div className='mb-4 flex w-full items-center justify-end gap-4'>
              <div className='flex items-center gap-2 text-[#00FFA9]'>
                {(() => {
                  if (acceptedFile)
                    return (
                      <>
                        <CheckIcon width='1.2rem' color='#00FFA9' />
                        {acceptedFile?.name?.length > 10
                          ? acceptedFile.name
                              .slice(0, 10)
                              .concat('....')
                              .concat(acceptedFile.name.slice(-7))
                          : acceptedFile.name}
                      </>
                    );
                })()}
              </div>
              <button
                type='button'
                {...getRootProps()}
                className='flex w-fit items-center justify-center rounded-md border border-[#464646] bg-[#262229] p-2 font-normal'
                size='sm'
              >
                <div>.csv upload</div>
                <ArrowUpCircleIcon width='1rem' />
              </button>
              {/* <button {...getRemoveFileProps()} style={styles.remove}>
                Remove
              </button> */}
            </div>
          </>
        )}
      </CSVReader>
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#262229',
          color: '#fff',
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
              {enteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{
                              color: '#fff',
                              backgroundColor: '#262229',
                              borderColor: '#262229',
                            }}
                          >
                            {column.id === 'destination_chain' && (
                              <ChainMenu
                                initialChain={row.destination_chain}
                                onChainChange={(_chain) => {
                                  const newdata = enteredRows.map((er) => {
                                    return er.id === row.id
                                      ? {
                                          ...er,
                                          destination_chain: _chain.id,
                                        }
                                      : er;
                                  });
                                  setEnteredRows(newdata);
                                }}
                              />
                            )}
                            {column.id === 'destination_token' && (
                              <TokenMenu
                                initialToken={row.destination_token}
                                onTokenChange={(token) => {
                                  const newdata = enteredRows.map((er) => {
                                    return er.id === row.id
                                      ? {
                                          ...er,
                                          destination_token: token
                                            ? token.address
                                            : '',
                                        }
                                      : er;
                                  });
                                  setEnteredRows(newdata);
                                }}
                              />
                            )}
                            {column.id === 'to_address' && (
                              <TokenInput
                                value={value as string}
                                placeholder='Enter Address'
                                className='text-start placeholder:text-white placeholder:text-opacity-20'
                                onChange={(e) => {
                                  const newdata = enteredRows.map((er) => {
                                    return er.id === row.id
                                      ? {
                                          ...er,
                                          to_address: e.target.value,
                                        }
                                      : er;
                                  });
                                  setEnteredRows(newdata);
                                }}
                              />
                            )}
                            {column.id === 'amount_of_source_token' && (
                              <TokenInput
                                value={value as string}
                                placeholder='Enter amount'
                                className='placeholder:text-white placeholder:text-opacity-20'
                                onChange={(e) => {
                                  const newdata = enteredRows.map((er) => {
                                    return er.id === row.id
                                      ? {
                                          ...er,
                                          amount_of_source_token:
                                            e.target.value,
                                        }
                                      : er;
                                  });
                                  setEnteredRows(newdata);
                                }}
                              />
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[2, 5, 10]}
          component='div'
          style={{
            backgroundColor: '#262626',
          }}
          className='text-white'
          count={enteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

const TokenInput: React.FC<React.ComponentPropsWithoutRef<'input'>> = ({
  className,
  ...rest
}) => {
  return (
    <input
      className={clsxm(
        'truncate rounded-sm border border-transparent bg-transparent px-3 py-2 text-end font-medium focus:border focus:border-white focus:outline-none',
        className
      )}
      {...rest}
    />
  );
};
