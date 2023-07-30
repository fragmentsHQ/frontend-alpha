import { sendTransaction, waitForTransaction } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { Address, parseEther } from 'viem';
import { encodeFunctionData } from 'viem';
import { useAccount, useNetwork, usePublicClient } from 'wagmi';

import {
  ETH,
  TREASURY_CONTRACT,
  TREASURY_CONTRACT_ADDRESSES,
} from '@/config/contracts';
import { TransactionState } from '@/hooks/useDepositBalance';

const useWithdrawBalance = ({ inputAmount }: { inputAmount: number }) => {
  const [hash, setHash] = useState('');
  const [transactionState, setTransactionState] =
    useState<TransactionState | null>(null);
  const [callDataWithdraw, setCallDataWithdraw] = useState<Address | null>(
    null
  );
  const { chain } = useNetwork();
  const { address } = useAccount();
  const provider = usePublicClient();

  const handleUpdateWithdraw = async ({
    inputAmount,
  }: {
    inputAmount: number;
  }) => {
    if (chain === undefined) return;
    if (!provider) return;
    const TreasuryContract = TREASURY_CONTRACT(chain);
    const callData = encodeFunctionData({
      abi: TreasuryContract.abi,
      functionName: 'withdrawFunds',
      args: [address, ETH, parseEther(`${inputAmount}`, 'wei')],
    });
    setCallDataWithdraw(callData);
  };

  useEffect(() => {
    if (!inputAmount) return;
    handleUpdateWithdraw({ inputAmount: inputAmount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callDataWithdraw, inputAmount]);

  const sendWithdrawTokenAsyncTxn = async () => {
    try {
      if (!callDataWithdraw) return;
      if (chain === undefined) return;
      setTransactionState(TransactionState.PROCESSING);
      const { hash } = await sendTransaction({
        to: TREASURY_CONTRACT_ADDRESSES[
          chain?.testnet ? 'testnets' : 'mainnets'
        ][chain?.id],
        value: parseEther(`${inputAmount}`, 'wei'),
        data: callDataWithdraw,
        mode: 'prepared',
      });
      const res = await waitForTransaction({
        hash,
      });
      setTransactionState(TransactionState.SUCCESS);
      return hash;
    } catch (error) {
      setTransactionState(TransactionState.FAILED);
      return null;
    }
  };

  return {
    sendWithdrawTokenAsyncTxn: sendWithdrawTokenAsyncTxn,
    transactionState: transactionState,
    hash: hash,
    setTransactionState: setTransactionState,
  };
};

export default useWithdrawBalance;
