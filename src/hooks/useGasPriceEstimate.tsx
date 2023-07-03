import {
  Chain,
  getNetwork,
  prepareSendTransaction,
  sendTransaction,
  waitForTransaction,
} from '@wagmi/core';
import dayjs from 'dayjs';
import { parseUnits } from 'ethers/lib/utils';
import toast from 'react-hot-toast';
import useGlobalStore, { useTableData } from 'store';
import { encodeFunctionData } from 'viem';

import {
  CONDITIONAL_CONTRACT_ADDRESSES,
  CONNEXT_DOMAINS,
  ZERO_ADDRESS,
} from '@/config/contracts';

import ConditionalAbi from '../abi/Conditional.json';

const useGasPriceEstimate = () => {
  const { chain } = getNetwork();
  const { enteredRows } = useTableData();
  const { sourceToken } = useGlobalStore();

  const createMultiplePriceFeedAutomate = async ({
    gas,
    _chain,
  }: {
    gas: string;
    _chain: Chain;
  }) => {
    if (!chain?.id) return;
    try {
      const args = [
        //_to (address[])
        [
          ...enteredRows.map((e) =>
            e.to_address ? e.to_address : ZERO_ADDRESS
          ),
        ],
        //_amount (uint256[])
        [
          ...enteredRows.map((e) =>
            e.amount_of_source_token
              ? parseUnits(e.amount_of_source_token, sourceToken?.decimals)
              : '0'
          ),
        ],
        // _price (uint256[])
        [parseFloat(gas)],
        // _fromToken (address[])
        [
          ...enteredRows.map((e) =>
            chain?.testnet && sourceToken ? sourceToken.address : ZERO_ADDRESS
          ),
        ],
        // _toToken (address[])
        [
          ...enteredRows.map((e) =>
            chain?.testnet && sourceToken && e.destination_chain
              ? e.destination_token
              : ZERO_ADDRESS
          ),
        ],
        // _toChain (uint256[])
        [
          ...enteredRows.map((e) =>
            e.destination_chain ? e.destination_chain : ZERO_ADDRESS
          ),
        ],
        // _destinationDomain (uint32[])
        [
          ...enteredRows.map((e) =>
            e.destination_chain
              ? CONNEXT_DOMAINS[e.destination_chain]
              : ZERO_ADDRESS
          ),
        ],
        // _destinationContract (address[])
        [
          ...enteredRows.map((e) =>
            e.destination_chain
              ? CONDITIONAL_CONTRACT_ADDRESSES[
                  chain?.testnet ? 'testnets' : 'mainnets'
                ][e.destination_chain]
              : ZERO_ADDRESS
          ),
        ],
        // _cycles (uint256[])
        [...enteredRows.map((_) => 1)],
        // _startTime (uint256[])
        [...enteredRows.map((_) => dayjs().unix())],
        // _interval (uint256[])
        [...enteredRows.map((_) => 1)],
        // _web3FunctionHash (string)
        'QmaR3iZVSzJJ43uWRbrbUvs2CUheHVXCTiU6hJ85asD2RW',
      ];
      const callDataCreateConditionalTxn = encodeFunctionData({
        abi: ConditionalAbi.abi,
        functionName: '_createMultiplePriceFeedAutomate',
        args: args,
      });

      const request = await prepareSendTransaction({
        request: {
          to: chain
            ? CONDITIONAL_CONTRACT_ADDRESSES[
                chain?.testnet ? 'testnets' : 'mainnets'
              ][chain?.id]
            : ZERO_ADDRESS,
          data: callDataCreateConditionalTxn,
          value: BigInt(0),
        },
      });
      const { hash } = await sendTransaction(request);
      const res = await waitForTransaction({
        hash,
      });
      toast.success('Transaction created successfully');
      return { hash: res.transactionHash };
    } catch (error) {
      console.error(error);
    }
  };

  const handleConditionalExecution = async ({
    gas,
    _chain,
  }: {
    gas: string;
    _chain: Chain;
  }) => {
    try {
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
      return createMultiplePriceFeedAutomate?.({
        gas,
        _chain,
      });
      // else throw new Error('Please approve the token');
    } catch (e) {
      toast.error('Please approve the token');
    }
  };

  return {
    handleConditionalExecution,
  };
};

export default useGasPriceEstimate;
