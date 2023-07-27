import { useMutation } from 'react-query';
import useGlobalStore from 'store';
import { useNetwork } from 'wagmi';

import { BUY_TOKENS, CONNEXT_DOMAINS, URL } from '@/config/contracts';

const useGetRelayerFee = () => {
  const { chain } = useNetwork();
  const { sourceToken } = useGlobalStore();

  const priceOfToken = async ({ amount }: { amount: number }) => {
    try {
      if (!amount) throw new Error('Missing amount');
      if (!chain?.id) throw new Error('Missing chain id');
      if (!sourceToken) throw new Error('Destination token address');
      const url =
        URL[chain.id] +
        'swap/v1/price?sellToken=' +
        sourceToken.address +
        '&buyToken=' +
        BUY_TOKENS[chain.id] +
        '&sellAmount=' +
        amount * Math.pow(10, sourceToken.decimals);

      const req = await fetch(url);
      const res = await req.json();
      return {
        price: res.buyAmount,
      };
    } catch (error) {
      return {
        price: null,
      };
    }
  };
  const getRelayerFee = async ({ toChain }: { toChain: number }) => {
    try {
      if (!toChain && !chain?.id && !sourceToken) {
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
  return useMutation(
    async ({ toChain, amount }: { toChain: number; amount: number }) => {
      if (!toChain || !sourceToken || amount === 0 || !amount) {
        return {
          fee: null,
          price: null,
        };
      }
      const result = await Promise.all([
        getRelayerFee({
          toChain,
        }),
        priceOfToken({
          amount: amount,
        }),
      ]);
      return {
        fee: result[0].fee,
        price: result[1].price,
      };
    }
  );
};

export default useGetRelayerFee;
