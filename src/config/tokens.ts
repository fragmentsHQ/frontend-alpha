import { ETH, MATIC } from '@/config/contracts';
import { Address } from 'viem';
import { goerli, polygon, polygonMumbai } from 'wagmi/chains';

export type Token = {
  id: string;
  symbol: string;
  name: string;
  isForwardGasSupported?: boolean;
  address: Address;
  decimals: number;
  image: string;
};

export const CHAIN_IMAGES = {
  [polygon.id]: {
    image_url: require('../../public/logo/chains/polygonMumbai.png'),
  },
  [polygonMumbai.id as number]: {
    image_url: require('../../public/logo/chains/polygonMumbai.png'),
  },
  [goerli.id as number]: {
    image_url: require('../../public/logo/chains/Goerli.png'),
  },
};

export const NATIVE_TOKENS = {
  [polygon.id as number]: ETH,
  [polygonMumbai.id as number]: ETH,
  [goerli.id as number]: ETH,
};

const getTokenDataMapper = (chainId: number) => {
  return require('./tokens/' + chainId + '.json');
};
export const TOKENS: Record<number, Token[]> = {
  [polygon.id]: getTokenDataMapper(polygon.id as number),
  [polygonMumbai.id as number]: getTokenDataMapper(polygonMumbai.id as number),
  [goerli.id as number]: getTokenDataMapper(goerli.id as number),
};
