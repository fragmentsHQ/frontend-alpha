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

const ISPRODUCTION = false;

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
    [polygonMumbai.id as number]: '0x7f464d4f3D46552F936cb68c21a0A2dB3E32919F',
    [goerli.id as number]: '0xa8e3315ce15caddb4616aefd073e4cbf002c5d73',
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
    800001: '0x1Ff5C1D4713772C5AA17d551039d9599Bc65C31C',
    5: '0x6e2b6959c81183dCe1EB5819E573092bee28511b',
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

const TREASURY_CONTRACT = (chain: Chain) =>
  getContract({
    address: chain
      ? TREASURY_CONTRACT_ADDRESSES[chain?.testnet ? 'testnets' : 'mainnets'][
          chain?.network
        ]
      : TREASURY_CONTRACT_ADDRESSES['testnets']['goerli'],
    abi: Autopay.abi,
  });

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
