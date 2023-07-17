import { useQuery } from '@apollo/client';
import React from 'react';
import { useAccount } from 'wagmi';

import TransactionTable from '@/components/table/transactions';

import { GetFundsDepositedsDocument } from '@/graphql/getFundsDeposited.generated';
import { GetFundsWithdrawnsDocument } from '@/graphql/getFundsWithdrawn.generated';

const AllTransactions = () => {
  const { address } = useAccount();

  const { data: fundsdata, loading } = useQuery(GetFundsDepositedsDocument, {
    variables: {
      where: { sender: address },
    },
  });

  const { data: withdrawnFunds, loading: isWithdrawnLoading } = useQuery(
    GetFundsWithdrawnsDocument,
    {
      variables: {
        where: { receiver: address },
      },
    }
  );

  if (!fundsdata || !withdrawnFunds) return null;

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
