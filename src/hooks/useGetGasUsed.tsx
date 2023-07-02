import { fetchTransaction } from '@wagmi/core';
import { BigNumber } from 'alchemy-sdk';
import React, { useEffect } from 'react';
import { Address } from 'viem';

const useGetGasUsed = ({ hash }: { hash: string }) => {
  const [gasUsed, setGasUsed] = React.useState('-');
  useEffect(() => {
    fetchTransaction({
      hash: hash as Address,
    }).then((s) => setGasUsed(BigNumber.from(s.gasPrice).toString()));
  }, [hash]);

  return parseFloat(gasUsed) / Math.pow(10, 9);
};

export default useGetGasUsed;
