import { useQuery } from '@apollo/client';
import React from 'react';
import { useAccount } from 'wagmi';

import TransactionTable from '@/components/table/transactions';

import { GetFundsDepositedsDocument } from '@/graphql/getFundsDeposited.generated';
import { GetFundsWithdrawnsDocument } from '@/graphql/getFundsWithdrawn.generated';
import { ImSpinner2 } from 'react-icons/im';

const AllTransactions = ({ client }: { client: 'endpoint1' | 'endpoint2' }) => {
  const { address } = useAccount();

  const { data: fundsdata, loading } = useQuery(GetFundsDepositedsDocument, {
    variables: {
      where: { sender: address },
    },
    context: { clientName: client },
  });

  const { data: withdrawnFunds, loading: isWithdrawnLoading } = useQuery(
    GetFundsWithdrawnsDocument,
    {
      variables: {
        where: { receiver: address },
      },
      context: { clientName: client },
    }
  );

  if (!fundsdata || !withdrawnFunds)
    return (
      <div
        className='flex h-[300px] w-full flex-col items-center 
   justify-center text-white '
      >
        <ImSpinner2 className='animate-spin' size={20} />
        <p className='mt-2'>Fetching Transaction history.....</p>
      </div>
    );

  return (
    <TransactionTable
      fundsdata={[
        ...fundsdata.fundsDepositeds,
        ...withdrawnFunds.fundsWithdrawns,
      ]}
      loading={loading || isWithdrawnLoading}
    />
  );
};

export default AllTransactions;
