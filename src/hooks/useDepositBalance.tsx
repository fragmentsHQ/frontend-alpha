import { sendTransaction } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useNetwork, useProvider } from 'wagmi';

import {
  ETH,
  TREASURY_CONTRACT,
  TREASURY_CONTRACT_ADDRESSES,
} from '@/config/contracts';

const useDepositBalance = ({ inputAmount }: { inputAmount: number }) => {
  const [callDataDeposit, setCallDataDeposit] = useState('');
  const { chain } = useNetwork();
  const { address } = useAccount();
  const provider = useProvider();

  const handleWithdraw = async ({ inputAmount }: { inputAmount: number }) => {
    if (chain === undefined) return;
    if (!provider) return;
    const TreasuryContract = TREASURY_CONTRACT(chain);

    setCallDataDeposit(
      TreasuryContract.interface.encodeFunctionData('depositFunds', [
        address,
        ETH,
        parseEther(`${inputAmount}`, 'wei'),
      ])
    );
  };

  useEffect(() => {
    if (!inputAmount) return;
    handleWithdraw({ inputAmount: inputAmount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callDataDeposit, inputAmount]);

  const sendDepositTokenAsyncTxn = async () => {
    try {
      if (chain === undefined) return;
      const { hash } = await sendTransaction({
        request: {
          to: TREASURY_CONTRACT_ADDRESSES[
            chain?.testnet ? 'testnets' : 'mainnets'
          ][chain?.id],
          value: parseEther(`${inputAmount}`, 'wei'),
          data: callDataDeposit,
          gasLimit: 180000,
        },
        mode: 'prepared',
      });
      return hash;
    } catch (error) {
      return null;
    }
  };

  return {
    sendDepositTokenAsyncTxn: sendDepositTokenAsyncTxn,
  };
};

export default useDepositBalance;
