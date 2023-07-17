import { sendTransaction } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useNetwork, useProvider } from 'wagmi';

import {
  ETH,
  TREASURY_CONTRACT,
  TREASURY_CONTRACT_ADDRESSES,
} from '@/config/contracts';

const useWithdrawBalance = ({ inputAmount }: { inputAmount: number }) => {
  const [callDataWithdraw, setCallDataWithdraw] = useState('');
  const { chain } = useNetwork();
  const { address } = useAccount();
  const provider = useProvider();

  const handleUpdateWithdraw = async ({
    inputAmount,
  }: {
    inputAmount: number;
  }) => {
    if (chain === undefined) return;
    if (!provider) return;
    const TreasuryContract = TREASURY_CONTRACT(chain);

    setCallDataWithdraw(
      TreasuryContract.interface.encodeFunctionData('withdrawFunds', [
        address,
        ETH,
        parseEther(`${inputAmount}`, 'wei'),
      ])
    );
  };

  useEffect(() => {
    if (!inputAmount) return;
    handleUpdateWithdraw({ inputAmount: inputAmount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callDataWithdraw, inputAmount]);

  const sendWithdrawTokenAsyncTxn = async () => {
    try {
      if (chain === undefined) return;
      const { hash } = await sendTransaction({
        request: {
          to: TREASURY_CONTRACT_ADDRESSES[
            chain?.testnet ? 'testnets' : 'mainnets'
          ][chain?.id],
          value: parseEther(`${inputAmount}`, 'wei'),
          data: callDataWithdraw,
          gasLimit: 100000,
        },
        mode: 'prepared',
      });
      return hash;
    } catch (error) {
      return null;
    }
  };

  return {
    sendWithdrawTokenAsyncTxn: sendWithdrawTokenAsyncTxn,
  };
};

export default useWithdrawBalance;
