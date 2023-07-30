import { useQuery } from '@apollo/client';
import React from 'react';
import { useAccount } from 'wagmi';

import TransactionTable from '@/components/table/transactions';

import { GetFundsWithdrawnsDocument } from '@/graphql/getFundsWithdrawn.generated';

const DepositTransactions = ({
  client,
}: {
  client: 'endpoint1' | 'endpoint2';
}) => {
  const { address } = useAccount();

  const { data: fundsdata, loading } = useQuery(GetFundsWithdrawnsDocument, {
    variables: {
      where: { receiver: address },
    },
    context: {
      clientName: client,
    },
  });

  return (
    <TransactionTable fundsdata={fundsdata.fundsWithdrawns} loading={loading} />
  );
};

export default DepositTransactions;
