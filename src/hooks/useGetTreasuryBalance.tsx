import { readContract } from '@wagmi/core';
import { BigNumber } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';

import { ETH } from '@/config/contracts';

import TreasuryAbi from '../abi/Treasury.json';
const useGetTreasuryBalance = () => {
  const { chain } = useNetwork();
  const [balance, setBalance] = useState(0);

  const { address } = useAccount();
  const { data: signer } = useWalletClient();

  const fetchB = async () => {
    try {
      if (!chain) return null;
      if (!signer) return;
      const data = await readContract({
        address: '0x6e2b6959c81183dCe1EB5819E573092bee28511b',
        abi: TreasuryAbi.abi,
        functionName: 'userTokenBalance',
        args: [address, ETH],
      });
      const ss = BigNumber.from(data).toString();
      setBalance((parseInt(ss) / Math.pow(10, 18)).toFixed(4));
    } catch (error) {
      setBalance(0);
    }
  };
  useEffect(() => {
    fetchB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, signer]);

  return balance;
};

export default useGetTreasuryBalance;
