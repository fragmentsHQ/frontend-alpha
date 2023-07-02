import { Address } from 'viem';
import { goerli, polygonMumbai } from 'wagmi/chains';

export type Token = {
  id: string;
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  image: string;
};

export const CHAIN_IMAGES = {
  [polygonMumbai.id as number]: {
    image_url: require('../../public/logo/chains/polygonMumbai.png'),
  },
  [goerli.id as number]: {
    image_url: require('../../public/logo/chains/Goerli.png'),
  },
};
export const TOKENS: Record<number, Token[]> = {
  [polygonMumbai.id as number]: [
    {
      id: '0',
      name: 'USDC',
      symbol: 'USDC',
      address: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
      decimals: 18,
      // logo: require('../../public/logo/tokens'),
      image:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
    },
    {
      id: '1',
      name: 'WETH',
      symbol: 'WETH',
      address: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      decimals: 18,
      // logo: require('../../public/weth.png'),
      image:
        'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    },
  ],
  [goerli.id as number]: [
    {
      id: '0',
      symbol: 'USDC',
      name: 'USDC',
      address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      decimals: 18,
      image:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1668148663',
    },
    {
      id: '1',
      symbol: 'WETH',
      name: 'WETH',
      address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      decimals: 18,
      image:
        'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    },
  ],
};
