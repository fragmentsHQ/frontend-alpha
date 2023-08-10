import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import React, { ComponentProps } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli, polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [
    alchemyProvider({ apiKey: 'NzvCDfoZ833NeFoQOXSXQDWfhCHhTa4u' }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Fragments',
  projectId: '103333b30405efc424b73b939a369d24',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const demoAppInfo = {
  appName: 'Fragments',
};
const WalletConfiguration: React.FC<ComponentProps<'div'>> = (props) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: '#fff',
          accentColorForeground: 'black',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
        modalSize='compact'
        initialChain={polygon}
        showRecentTransactions
        appInfo={demoAppInfo}
        chains={chains}
      >
        {props.children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default WalletConfiguration;
