import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  CheckIcon,
} from '@heroicons/react/20/solid';
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
import { Data, useTableData } from 'store';
import { v4 } from 'uuid';

const TEST_ADD = '0xd67D11499679CBcd33c0c2a7B792FC3d6aE628e9';

import { TextField } from '@mui/material';

import clsxm from '@/lib/clsxm';
import useGetRelayerFee from '@/hooks/useGetRelayerFee';

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
  const [invalidFormat, setInvalidFormat] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { enteredRows, setEnteredRows } = useTableData();
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
          try {
            setInvalidFormat(false);
            const csvdata = results.data
              .slice(1)
              .map((elem: number[] | string[]) => {
                if (
                  (elem[1] as string).length !== TEST_ADD.length &&
                  !(elem[1] as string).startsWith('0x')
                ) {
                  throw new Error('Invalid token address');
                }
                if (
                  (elem[2] as string).length !== TEST_ADD.length &&
                  !(elem[1] as string).startsWith('0x')
                ) {
                  throw new Error('Invalid token address');
                }

                return {
                  id: v4(),
                  to_address: elem[2],
                  destination_chain: parseInt(elem[0] as string),
                  destination_token: elem[1],
                  amount_of_source_token: elem[3],
                };
              });

            setEnteredRows(csvdata);
          } catch (error) {
            setInvalidFormat(true);
            setEnteredRows(enteredRows);
          }
        }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {({ getRootProps, acceptedFile }: any) => (
          <>
            <div className='mb-4 flex w-full items-center justify-end gap-4'>
              {invalidFormat ? (
                <p className='text-red-400'>Invalid csv format</p>
              ) : (
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
              )}

              <button
                type='button'
                {...getRootProps()}
                className='flex w-fit items-center justify-center rounded-md border border-[#464646] bg-[#262229] p-2 font-normal'
                size='sm'
              >
                <div>.csv upload</div>
                <ArrowUpCircleIcon width='1rem' />
              </button>
              <form method='get' action='/sample.csv'>
                <button
                  type='submit'
                  className='flex w-fit items-center justify-center rounded-md border border-[#464646] bg-[#262229] p-2 font-normal'
                >
                  <div className='mr-1'>sample.csv</div>
                  <ArrowDownCircleIcon width='1rem' />
                </button>
              </form>
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
                <TableCell
                  padding='checkbox'
                  style={{
                    color: '#ffff',
                    borderColor: '#373A40',
                    backgroundColor: '#373A40',
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return <TokenTableRow key={index} row={row} />;
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

const TokenTableRow: React.FC<{
  row: Data;
}> = ({ row }): JSX.Element => {
  const { data } = useGetRelayerFee({
    toChain: 5,
    destinationTokenAddress: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
  });
  console.log(data, 'Relayer fees');
  const { enteredRows, setEnteredRows } = useTableData();

  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
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
                selectedChain={row.destination_chain}
                onTokenChange={(token) => {
                  const newdata = enteredRows.map((er) => {
                    return er.id === row.id
                      ? {
                          ...er,
                          destination_token: token ? token.address : '',
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
                onValueChange={(value, error) => {
                  if (error) {
                    const newdata = enteredRows.map((er) => {
                      return er.id === row.id
                        ? {
                            ...er,
                            to_address: '',
                          }
                        : er;
                    });
                    setEnteredRows(newdata);
                  } else {
                    const newdata = enteredRows.map((er) => {
                      return er.id === row.id
                        ? {
                            ...er,
                            to_address: value,
                          }
                        : er;
                    });
                    setEnteredRows(newdata);
                  }
                }}
              />
            )}
            {column.id === 'amount_of_source_token' && (
              <AmountInput
                value={value as string}
                placeholder='Enter amount'
                onValueChange={(value, error) => {
                  if (error) {
                    const newdata = enteredRows.map((er) => {
                      return er.id === row.id
                        ? {
                            ...er,
                            amount_of_source_token: '',
                          }
                        : er;
                    });
                    setEnteredRows(newdata);
                    return;
                  }
                  const newdata = enteredRows.map((er) => {
                    return er.id === row.id
                      ? {
                          ...er,
                          amount_of_source_token: value,
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
      <TableCell
        padding='checkbox'
        style={{
          color: '#fff',
          backgroundColor: '#262229',
          borderColor: '#262229',
        }}
      >
        <div className='flex h-full w-full items-center justify-end space-x-3 pr-4'>
          {enteredRows[enteredRows.length - 1].id === row.id && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              role='button'
              viewBox='0 0 24 24'
              onClick={() => {
                setEnteredRows([
                  ...enteredRows,
                  {
                    id: v4(),
                    amount_of_source_token: '',
                    destination_chain: 0,
                    destination_token: '',
                    to_address: '',
                  },
                ]);
              }}
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-[24px] w-[24px]'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          )}

          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            role='button'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-6 w-6'
            onClick={() => {
              try {
                if (enteredRows.length === 1) return;
                const fil = enteredRows.filter((d) => d.id !== row.id);
                setEnteredRows(fil);
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
            />
          </svg>
        </div>
      </TableCell>
    </TableRow>
  );
};

const TokenInput: React.FC<
  React.ComponentPropsWithoutRef<'input'> & {
    onValueChange: (value: string, isError: boolean) => void;
  }
> = ({ value, onValueChange }) => {
  const [isError, setIsError] = React.useState(false);
  return (
    <TextField
      error={isError}
      id='filled-error-helper-tecasxt'
      style={{
        backgroundColor: '#262229',
        width: '100%',
      }}
      value={value}
      onChange={(e) => {
        if (e.target.value === '') {
          setIsError(false);
          return;
        }
        if (!e.target.value.match(/^0x[a-fA-F0-9]{40}$/g)) {
          onValueChange(e.target.value, isError);
          setIsError(true);
        } else {
          onValueChange(e.target.value, isError);
          setIsError(false);
        }
      }}
      placeholder='Enter Address'
      helperText={isError ? 'Please enter a valid address' : ''}
    />
  );
};
const AmountInput: React.FC<
  React.ComponentPropsWithoutRef<'input'> & {
    onValueChange: (value: string, isError: boolean) => void;
  }
> = ({ className, onValueChange, ...rest }) => {
  const [isError, setIsError] = React.useState(false);

  return (
    <div className='flex flex-col'>
      <input
        className={clsxm(
          'truncate rounded-sm border border-transparent bg-transparent px-3 py-2 text-end font-medium focus:right-0 focus:border focus:border-white focus:outline-none',
          isError && 'border-2 border-red-700',
          className
        )}
        type='number'
        onChange={(e) => {
          setIsError(false);
          onValueChange(e.target.value, false);
          setIsError(false);
        }}
        {...rest}
      />
      {isError && (
        <span className='font-bold text-red-700'>Max Limit is 200</span>
      )}
    </div>
  );
};
