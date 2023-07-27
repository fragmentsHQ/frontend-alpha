import React from 'react';
const useGetCrossChainData = ({
  chainId,
  transactionHash,
}: {
  chainId: number;
  transactionHash: string;
}) => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/cross-chain-data', {
        method: 'POST',
        body: JSON.stringify({
          chain_id: chainId,
          transaction_hash: transactionHash,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  };
  React.useEffect(() => {
    if (!chainId) {
      return;
    }
    if (!transactionHash) {
      return;
    }
    fetchData();
  }, []);
  return {
    amount: 0,
    token: '-',
    chain: '-',
  };
};

export default useGetCrossChainData;
