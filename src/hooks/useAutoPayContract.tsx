import {
  Chain,
  erc20ABI,
  getAccount,
  getNetwork,
  prepareSendTransaction,
  readContract,
  sendTransaction,
  waitForTransaction,
} from '@wagmi/core';
import { BigNumber } from 'alchemy-sdk';
import { MaxUint256 } from 'ethers';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useGlobalStore, { useTableData } from 'store';
import { encodeFunctionData, parseUnits } from 'viem';

import AutoPayAbi from '../abi/Autopay.json';
import {
  AUTOPAY_CONTRACT_ADDRESSES,
  CONNEXT_DOMAINS,
  ZERO_ADDRESS,
} from '../config/contracts';

type AutomationArguments = {
  start_time: number;
  interval_type: 'days' | 'weeks' | 'months' | 'years' | null;
  cycles: number;
  interval_count: string;
  isForwardPayingGas: boolean;
};

const useAutoPayContract = () => {
  const { chain } = getNetwork();
  const { address } = getAccount();
  const { sourceToken } = useGlobalStore();
  const { enteredRows } = useTableData();
  const [transactionHash, setTransactionHash] = useState('');
  const fetchAllowance = async (chain: Chain) => {
    try {
      const allowance = await readContract({
        address: chain && sourceToken ? sourceToken.address : ZERO_ADDRESS,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [
          address ? address : ZERO_ADDRESS,
          chain
            ? AUTOPAY_CONTRACT_ADDRESSES[
                chain?.testnet ? 'testnets' : 'mainnets'
              ][chain?.id]
            : ZERO_ADDRESS,
        ],
      });
      if (BigNumber.from(allowance).isZero()) {
        return null;
      }
      const enteredAmount = enteredRows.reduce((acc, curr) => {
        return Number(acc) + Number(curr.amount_of_source_token);
      }, 0);

      if (enteredAmount > parseFloat(BigNumber.from(allowance).toString())) {
        return null;
      }

      return allowance;
    } catch (error) {
      return null;
    }
  };

  const handleApprove = async () => {
    try {
      if (!sourceToken || !chain) {
        toast.error('Please select a token');
        return;
      }

      const callDataApproval = encodeFunctionData({
        abi: erc20ABI,
        functionName: 'approve',
        args: [
          chain
            ? AUTOPAY_CONTRACT_ADDRESSES[
                chain?.testnet ? 'testnets' : 'mainnets'
              ][chain?.id]
            : ZERO_ADDRESS,
          MaxUint256,
        ],
      });

      const request = await prepareSendTransaction({
        to: sourceToken.address,
        data: callDataApproval,
        value: BigInt(0),
      });
      const { hash } = await sendTransaction(request);

      await waitForTransaction({
        hash,
      });

      await fetchAllowance(chain);
      return true;
    } catch (error) {
      return false;
    }
  };

  const createTimeAutomateTxn = async ({
    start_time,
    interval_type,
    interval_count = '1',
    cycles,
    isForwardPayingGas,
  }: AutomationArguments) => {
    try {
      const args = [
        [
          ...enteredRows.map((e) =>
            e.to_address ? e.to_address : ZERO_ADDRESS
          ),
        ],
        [
          ...enteredRows.map((e) =>
            e.amount_of_source_token
              ? parseUnits(
                  e.amount_of_source_token,
                  sourceToken?.decimals as number
                )
              : '0'
          ),
        ],
        [...enteredRows.map(() => sourceToken?.address)],
        [...enteredRows.map((e) => e.destination_token)],
        [...enteredRows.map((e) => e.destination_chain)],
        [
          ...enteredRows.map((e) =>
            e.destination_chain
              ? CONNEXT_DOMAINS[e.destination_chain as number]
              : ZERO_ADDRESS
          ),
        ],
        [
          ...enteredRows.map((e) =>
            e.destination_chain
              ? AUTOPAY_CONTRACT_ADDRESSES[
                  chain?.testnet ? 'testnets' : 'mainnets'
                ][e.destination_chain as number]
              : ZERO_ADDRESS
          ),
        ],
        [...enteredRows.map((_) => (cycles ? cycles : 1))],
        [...enteredRows.map((_) => start_time)],
        [
          ...enteredRows.map((_) =>
            interval_type && interval_count
              ? Number(interval_count) *
                (interval_type === 'days'
                  ? 86400
                  : interval_type === 'months'
                  ? 2629800
                  : interval_type === 'weeks'
                  ? 604800
                  : interval_type === 'years'
                  ? 31536000
                  : 1)
              : 1
          ),
        ],
        isForwardPayingGas,
      ];
      const callDataCreateTimeTxn = encodeFunctionData({
        abi: AutoPayAbi.abi,
        functionName: '_createMultipleTimeAutomate',
        args: args,
      });
      const request = await prepareSendTransaction({
        to: chain
          ? AUTOPAY_CONTRACT_ADDRESSES[
              chain?.testnet ? 'testnets' : 'mainnets'
            ][chain?.id]
          : ZERO_ADDRESS,
        data: callDataCreateTimeTxn,

        value: BigInt(0),
      });
      const { hash } = await sendTransaction(request);
      const res = await waitForTransaction({
        hash,
      });
      toast.success('Transaction created successfully');
      return { hash: res.transactionHash };
    } catch (error) {
      return { hash: null };
    }
  };

  const handleTimeExecution = async (props: AutomationArguments) => {
    try {
      if (!chain) {
        throw new Error('Chain not found ');
      }
      // const allowance = await fetchAllowance(chain);
      // write to check if proper allowance is provider
      // console.log(
      //   BigNumber.from(allowance ? allowance : 0).eq(
      //     ethers.constants.MaxUint256
      //   )
      // );
      // if (
      //   BigNumber.from(allowance ? allowance : 0).eq(
      //     ethers.constants.MaxUint256
      //   )
      // )
      return createTimeAutomateTxn?.(props);
    } catch (e) {
      toast.error('Something went wrong');
    }
  };

  return {
    fetchAllowance,
    handleApprove,
    handleTimeExecution,
  };
};

export default useAutoPayContract;
