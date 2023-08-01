import React, { ComponentProps } from 'react';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import '@rainbow-me/rainbowkit/styles.css';
const projectId = '103333b30405efc424b73b939a369d24';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli, polygonMumbai],
  [w3mProvider({ projectId }), publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
  webSocketPublicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

const WalletConfiguration: React.FC<ComponentProps<'div'>> = (props) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{props.children}</WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        enableAccountView={true}
        chainImages={{
          80001: '/logo/chains/polygon.webp',
          5: '/logo/chains/Goerli.png',
        }}
        enableNetworkView={true}
        themeMode='dark'
      />
    </>
  );
};

export default WalletConfiguration;
