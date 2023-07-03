import {
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
  AUTOPAY_CONTRACT_ADDRESSES,
  CONNEXT_DOMAINS,
  ZERO_ADDRESS,
} from '@/config/contracts';

import AutoPayAbi from '../abi/Autopay.json';

const usePriceFeed = () => {
  const { chain } = getNetwork();
  const { enteredRows } = useTableData();
  const { sourceToken } = useGlobalStore();

  const CreateConditionalAutomateTxn = async ({
    ratio,
    token1,
    token2,
  }: {
    ratio: string;
    token1: string;
    token2: string;
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
        [ratio],
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
        // _tokenA (address[])
        [token1],
        // _tokenB (address[])
        [token2],
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
              ? AUTOPAY_CONTRACT_ADDRESSES[
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
        'QmPb9cXbcLbR6buvw6eYaH2hwjad1mtkxGq9GbsBnjz5EH',
      ];

      const callDataCreateConditionalTxn = encodeFunctionData({
        abi: AutoPayAbi.abi,
        functionName: '_createMultipleConditionalAutomate',
        args: args,
      });

      const request = await prepareSendTransaction({
        request: {
          to: chain
            ? AUTOPAY_CONTRACT_ADDRESSES[
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
    ratio,
    token1,
    token2,
  }: {
    ratio: string;
    token1: string;
    token2: string;
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
      return CreateConditionalAutomateTxn?.({
        ratio: ratio,
        token1: token1,
        token2: token2,
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

export default usePriceFeed;
