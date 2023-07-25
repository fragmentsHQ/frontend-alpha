import React, { ComponentProps } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  arbitrum,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
  zora,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [goerli, polygonMumbai]
      : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
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
        initialChain={polygonMumbai}
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
