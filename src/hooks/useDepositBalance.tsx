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
import { waitForTransactionReceipt } from 'viem/dist/types/actions/public/waitForTransactionReceipt';

export enum TransactionState {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROCESSING = 'processsing',
}

const useDepositBalance = ({ inputAmount }: { inputAmount: number }) => {
  const [hash, setHash] = useState('');
  const [transactionState, setTransactionState] =
    useState<TransactionState | null>(null);
  const [callDataDeposit, setCallDataDeposit] = useState<Address | null>(null);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const provider = usePublicClient();

  const handleWithdraw = async ({ inputAmount }: { inputAmount: number }) => {
    if (chain === undefined) return;
    if (!provider) return;
    const TreasuryContract = TREASURY_CONTRACT(chain);
    const callData = encodeFunctionData({
      abi: TreasuryContract.abi,
      functionName: 'depositFunds',
      args: [address, ETH, parseEther(`${inputAmount}`, 'wei')],
    });
    setCallDataDeposit(callData);
  };

  useEffect(() => {
    if (!inputAmount) return;
    handleWithdraw({ inputAmount: inputAmount });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callDataDeposit, inputAmount]);

  const sendDepositTokenAsyncTxn = async () => {
    try {
      if (!callDataDeposit) return;
      if (chain === undefined) return;
      setTransactionState(TransactionState.PROCESSING);
      const { hash } = await sendTransaction({
        to: TREASURY_CONTRACT_ADDRESSES[
          chain?.testnet ? 'testnets' : 'mainnets'
        ][chain?.id],
        value: parseEther(`${inputAmount}`, 'wei'),
        data: callDataDeposit,
        mode: 'prepared',
      });
      const res = await waitForTransaction({
        hash,
      });
      setTransactionState(TransactionState.SUCCESS);
      setHash(hash);
      return hash;
    } catch (error) {
      setTransactionState(TransactionState.FAILED);
      return null;
    }
  };

  return {
    sendDepositTokenAsyncTxn: sendDepositTokenAsyncTxn,
    transactionState: transactionState,
    hash: hash,
    setTransactionState: setTransactionState,
  };
};

export default useDepositBalance;
