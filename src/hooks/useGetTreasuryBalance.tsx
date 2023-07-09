import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';

import { ETH, TREASURY_CONTRACT } from '@/config/contracts';
const useGetTreasuryBalance = () => {
  const { chain } = useNetwork();
  const [balance, setBalance] = useState(0);

  const { address } = useAccount();
  const { data: signer } = useSigner();

  const fetchB = async () => {
    try {
      if (!chain) return null;
      if (!signer) return;
      const contract = TREASURY_CONTRACT(chain);
      const checkBalance = await contract.userTokenBalance(address, ETH);
      setBalance(checkBalance);
    } catch (error) {
      setBalance(0);
    }
  };
  useEffect(() => {
    fetchB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  return balance;
};

export default useGetTreasuryBalance;
