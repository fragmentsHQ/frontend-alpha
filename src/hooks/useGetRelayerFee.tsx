import { useQuery } from 'react-query';
import { useNetwork } from 'wagmi';

import { BUY_TOKENS, CONNEXT_DOMAINS, URL } from '@/config/contracts';

const useGetRelayerFee = ({
  toChain,
  destinationTokenAddress,
}: {
  toChain: number;
  destinationTokenAddress: string;
}) => {
  const { chain } = useNetwork();

  const priceOfToken = async () => {
    try {
      if (!chain?.id) throw new Error('Missing chain id');
      if (!destinationTokenAddress)
        throw new Error('Destination token address');
      const url =
        URL[toChain] +
        'swap/v1/price?sellToken=' +
        destinationTokenAddress +
        '&buyToken=' +
        BUY_TOKENS[toChain] +
        '&sellAmount=1000000000000000000';
      // sellAMt * token decimal

      // after getting the resp get buyAmount and compare it with the Fee from connext
      const req = await fetch(url);

      const res = await req.json();
      debugger;
      return {
        price: res.price,
      };
    } catch (error) {
      return {
        price: null,
      };
    }
  };
  const getRelayerFee = async () => {
    try {
      if (!toChain && !chain?.id && destinationTokenAddress === '') {
        throw new Error('Missing chain id');
      }
      const req = await fetch(
        `https://connext-relayer-fee.vercel.app/` +
          CONNEXT_DOMAINS[chain?.id as number] +
          '/' +
          CONNEXT_DOMAINS[toChain]
      );
      const res = await req.json();
      return {
        fee: res.FEE,
      };
    } catch (error) {
      return {
        fee: null,
      };
    }
  };
  return useQuery(
    'relayerFee',
    async () => {
      if (!toChain || !destinationTokenAddress) {
        return {
          fee: null,
          price: null,
        };
      }
      const result = await Promise.all([getRelayerFee(), priceOfToken()]);
      return {
        fee: result[0].fee,
        price: result[1].price,
      };
    },
    {
      enabled: !!toChain && !!destinationTokenAddress,
    }
  );
};

export default useGetRelayerFee;
