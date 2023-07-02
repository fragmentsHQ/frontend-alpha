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
    {
      id: '4',
      name: 'UNI',
      symbol: 'UNI',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      decimals: 18,
      // logo: require('../../public/weth.png'),
      image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
    },
  ],
  [goerli.id as number]: [
    {
      id: '0',
      symbol: 'USDC',
      name: 'USDC',
      address: '0x5ffbac75efc9547fbc822166fed19b05cd5890bb',
      decimals: 18,
      image:
        'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
    },
    {
      id: '1',
      symbol: 'WETH',
      name: 'WETH',
      address: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
      decimals: 18,
      image:
        'https://assets.coingecko.com/coins/images/2518/small/weth.png?1628852295',
    },
    {
      id: '2',
      symbol: 'UNI',
      name: 'UNI',
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      decimals: 18,
      image:
        'https://assets.coingecko.com/coins/images/12504/small/uni.jpg?1687143398',
    },
    {
      id: '3',
      symbol: 'DAI',
      name: 'DAI',
      address: '0xe68104d83e647b7c1c15a91a8d8aad21a51b3b3e',
      decimals: 18,
      image:
        'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
    },
  ],
};
