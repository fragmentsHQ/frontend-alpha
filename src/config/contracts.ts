import { getContract } from '@wagmi/core';
import { Address, Chain, erc20ABI } from 'wagmi';
import {
  arbitrumGoerli,
  goerli,
  optimismGoerli,
  polygon,
  polygonMumbai,
  polygonZkEvmTestnet,
} from 'wagmi/chains';

import Autopay from '../abi/Autopay.json';
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
export const MATIC = '0x0000000000000000000000000000000000001010';

const AUTOPAY_CONTRACT_ADDRESSES: ContractAddresses = {
  mainnets: {
    [polygon.id]: '0xD5deC37fcA54a234Ea7b4AeA41657171381eDE76',
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

const TREASURY_CONTRACT_ADDRESSES: ContractAddresses = {
  mainnets: {
    [polygon.id]: '0xD5deC37fcA54a234Ea7b4AeA41657171381eDE76',
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

const CONNEXT_DOMAINS = {
  [polygon.id]: '1886350457',
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
          chain?.id
        ]
      : AUTOPAY_CONTRACT_ADDRESSES['testnets']['goerli'],
    abi: Autopay.abi,
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

const ERC20_CONTRACT = (tokenAddress: Address) =>
  getContract({
    address: tokenAddress,
    abi: erc20ABI,
  });

export {
  AUTOPAY_CONTRACT,
  AUTOPAY_CONTRACT_ADDRESSES,
  CONNEXT_DOMAINS,
  ERC20_CONTRACT,
  ETH,
  ISPRODUCTION,
  TREASURY_CONTRACT,
  TREASURY_CONTRACT_ADDRESSES,
  ZERO_ADDRESS,
};

interface ContractAddresses {
  [key: string]: {
    [key: string]: `0x${string}`;
  };
}
