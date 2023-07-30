import { useQuery } from '@apollo/client';
import React from 'react';
import { useAccount } from 'wagmi';

import TransactionTable from '@/components/table/transactions';

import { GetFundsDepositedsDocument } from '@/graphql/getFundsDeposited.generated';

const DepositTransactions = ({
  client,
}: {
  client: 'endpoint1' | 'endpoint2';
}) => {
  const { address } = useAccount();

  const { data: fundsdata, loading } = useQuery(GetFundsDepositedsDocument, {
    variables: {
      where: { sender: address },
    },
    context: {
      clientName: client,
    },
  });

  return (
    <TransactionTable fundsdata={fundsdata.fundsDepositeds} loading={loading} />
  );
};

export default DepositTransactions;
