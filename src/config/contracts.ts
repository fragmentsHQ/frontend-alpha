import { getContract, goerli } from '@wagmi/core';
import { Chain, erc20ABI } from 'wagmi';
import {
  arbitrumGoerli,
  optimismGoerli,
  polygonMumbai,
  polygonZkEvmTestnet,
} from 'wagmi/chains';

import Autopay from '../abi/Autopay.json';
import Conditional from '../abi/Conditional.json';
import Treasury from '../abi/Treasury.json';

export const ethReg = /^0x[a-fA-F0-9]{40}$/g;

const ISPRODUCTION = false;

export const URL: Record<number, string> = {
  1: 'https://api.0x.org/',
  5: 'https://goerli.api.0x.org/',
  137: 'https://polygon.api.0x.org/',
  80001: 'https://mumbai.api.0x.org/',
  38: 'https://bsc.api.0x.org/',
  10: 'https://optimism.api.0x.org/',
  250: 'https://fantom.api.0x.org/',
  42220: 'https://celo.api.0x.org/',
  43114: 'https://avalanche.api.0x.org/',
  42161: 'https://arbitrum.api.0x.org/',
};
export const BUY_TOKENS: Record<number, string> = {
  1: 'ETH',
  5: 'ETH',
  137: 'https://polygon.api.0x.org/',
  80001: 'MATIC',
  38: 'https://bsc.api.0x.org/',
  10: 'https://optimism.api.0x.org/',
  250: 'https://fantom.api.0x.org/',
  42220: 'https://celo.api.0x.org/',
  43114: 'https://avalanche.api.0x.org/',
  42161: 'https://arbitrum.api.0x.org/',
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

const Web3FunctionHash = {
  autopay: 'QmbN96rTEy8EYxPNVqCUmZgTZzufvCbNhmsVzM2rephoLa',
  gas: '',
  conditional: '',
  contract: '',
};

const AUTOPAY_CONTRACT_ADDRESSES: ContractAddresses = {
  mainnets: {
    polygon: '0x',
    ethereum: '0x',
    optimism: '0x',
    arbitrum: '0x',
    bsc: '0x',
  },
  testnets: {
    [polygonMumbai.id as number]: '0x7f464d4f3d46552f936cb68c21a0a2db3e32919f',
    [goerli.id as number]: '0xA8e3315CE15cADdB4616AefD073e4CBF002C5D73',
  },
};

const CONDITIONAL_CONTRACT_ADDRESSES: ContractAddresses = {
  mainnets: {
    polygon: '0x',
    ethereum: '0x',
    optimism: '0x',
    arbitrum: '0x',
    bsc: '0x',
  },
  testnets: {
    [polygonMumbai.id as number]: '0x927CFeBA7c83f2626ca09A815Bce899190Cb5800',
    [goerli.id as number]: '0xDc7EcF12CFf43ea2d40Ad475b6BB0C5Fe6dD368A',
  },
};

const TREASURY_CONTRACT_ADDRESSES: ContractAddresses = {
  mainnets: {
    polygon: '0x',
    ethereum: '0x',
    optimism: '0x',
    arbitrum: '0x',
    bsc: '0x',
  },
  testnets: {
    [polygonMumbai.id]: '0x1Ff5C1D4713772C5AA17d551039d9599Bc65C31C',
    [goerli.id]: '0x6e2b6959c81183dCe1EB5819E573092bee28511b',
  },
};

const TOKEN_ADDRESSES_PRICE_FEEDS = {
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  AAVE: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  SHIB: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
};

const CONNEXT_DOMAINS = {
  [goerli.id as number]: '1735353714',
  [optimismGoerli.id as number]: '1735356532',
  [polygonMumbai.id as number]: '9991',
  [arbitrumGoerli.id as number]: '1734439522',
  [polygonZkEvmTestnet.id as number]: '1887071092',
};

const AUTOPAY_CONTRACT = (chain: Chain) =>
  getContract({
    address: chain
      ? AUTOPAY_CONTRACT_ADDRESSES[chain?.testnet ? 'testnets' : 'mainnets'][
          chain?.network
        ]
      : AUTOPAY_CONTRACT_ADDRESSES['testnets']['goerli'],
    abi: Autopay.abi,
  });

const CONDITIONAL_CONTRACT = (chain: Chain) =>
  getContract({
    address: chain
      ? CONDITIONAL_CONTRACT_ADDRESSES[
          chain?.testnet ? 'testnets' : 'mainnets'
        ][chain?.network]
      : CONDITIONAL_CONTRACT_ADDRESSES['testnets']['goerli'],
    abi: Conditional.abi,
  });

const TREASURY_CONTRACT = (chain: Chain) => {
  {
    return getContract({
      address: chain
        ? TREASURY_CONTRACT_ADDRESSES[chain?.testnet ? 'testnets' : 'mainnets'][
            chain.id
          ]
        : TREASURY_CONTRACT_ADDRESSES['testnets'][goerli.id],
      abi: Treasury.abi,
    });
  }
};

const ERC20_CONTRACT = (tokenAddress: string) =>
  getContract({
    address: tokenAddress,
    abi: erc20ABI,
  });

export {
  AUTOPAY_CONTRACT,
  AUTOPAY_CONTRACT_ADDRESSES,
  CONDITIONAL_CONTRACT,
  CONDITIONAL_CONTRACT_ADDRESSES,
  CONNEXT_DOMAINS,
  ERC20_CONTRACT,
  ETH,
  ISPRODUCTION,
  TOKEN_ADDRESSES_PRICE_FEEDS,
  TREASURY_CONTRACT,
  TREASURY_CONTRACT_ADDRESSES,
  Web3FunctionHash,
  ZERO_ADDRESS,
};

interface ContractAddresses {
  [key: string]: {
    [key: string]: `0x${string}`;
  };
}
