import { readContract } from '@wagmi/core';
import { BigNumber } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useWalletClient } from 'wagmi';

import { ETH, TREASURY_CONTRACT_ADDRESSES, MATIC } from '@/config/contracts';

import TreasuryAbi from '../abi/Treasury.json';
import { NATIVE_TOKENS } from '@/config/tokens';
const useGetTreasuryBalance = () => {
  const { chain } = useNetwork();
  const [balance, setBalance] = useState(0);

  const { address } = useAccount();
  const { data: signer } = useWalletClient();

  const fetchBalance = async () => {
    try {
      if (!chain) return null;
      if (!signer) return;
      const data = await readContract({
        address:
          TREASURY_CONTRACT_ADDRESSES[chain.testnet ? 'testnets' : 'mainnet'][
            chain.id
          ],
        abi: TreasuryAbi.abi,
        functionName: 'userTokenBalance',
        args: [address, NATIVE_TOKENS[chain.id]],
      });
      setBalance(
        parseFloat(
          (
            parseInt(BigNumber.from(data).toString()) / Math.pow(10, 18)
          ).toFixed(4)
        )
      );
    } catch (error) {
      setBalance(0);
    }
  };
  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, signer]);

  return balance;
};

export default useGetTreasuryBalance;
