import { ETH, MATIC } from '@/config/contracts';
import { Address } from 'viem';
import { goerli, polygonMumbai } from 'wagmi/chains';

export type Token = {
  id: string;
  symbol: string;
  name: string;
  isSupportedForwardGas?: boolean;
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

export const NATIVE_TOKENS = {
  [polygonMumbai.id as number]: ETH,
  [goerli.id as number]: ETH,
};
export const TOKENS: Record<number, Token[]> = {
  [polygonMumbai.id as number]: [
    {
      id: '0',
      name: 'USDC',
      symbol: 'USDC',
      address: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
      isSupportedForwardGas: true,
      decimals: 6,
      // logo: require('../../public/logo/tokens'),
      image:
        'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
    },
    {
      id: '1',
      name: 'wMatic',
      symbol: 'wMatic',
      address: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      isSupportedForwardGas: true,
      decimals: 18,
      // logo: require('../../public/weth.png'),
      image:
        'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912',
    },
  ],
  [goerli.id as number]: [
    {
      id: '0',
      symbol: 'USDC',
      name: 'USDC',
      address: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
      isSupportedForwardGas: true,
      decimals: 6,
      image:
        'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
    },
    {
      id: '1',
      symbol: 'WETH',
      name: 'WETH',
      address: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      isSupportedForwardGas: true,
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
