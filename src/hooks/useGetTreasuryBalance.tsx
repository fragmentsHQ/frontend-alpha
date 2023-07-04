import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import { ETH, TREASURY_CONTRACT } from '@/config/contracts';
const useGetTreasuryBalance = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const fetchB = async () => {
    if (!chain) return null;
    const contract = TREASURY_CONTRACT(chain);
    console.log(contract);

    const checkBalance = await contract.userTokenBalance(address, ETH);
    console.log(checkBalance.toString());
  };
  useEffect(() => {
    fetchB();
  }, [chain]);

  return 'allowance';
};

export default useGetTreasuryBalance;
