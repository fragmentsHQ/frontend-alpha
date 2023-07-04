import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import {
  connectorsForWallets,
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  ledgerWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

import InitiateProvider from '@/components/InitiateProvider';
import Seo from '@/components/Seo';

const { chains, provider, webSocketProvider } = configureChains(
  // [mainnet, polygonMumbai, goerli, gnosis, bsc, arbitrum, polygonZkEvm],
  [polygonMumbai, goerli],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: 'Secure stables',
  chains,
});

const demoAppInfo = {
  appName: 'Secure stables',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const queryClient = new QueryClient();
const apolloClient = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/proxy/18071/fragments/version/latest',
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: '#fff',
              accentColorForeground: 'black',
              borderRadius: 'large',
              fontStack: 'system',
              overlayBlur: 'small',
            })}
            modalSize='compact'
            showRecentTransactions
            appInfo={demoAppInfo}
            chains={chains}
          >
            <Seo />
            <InitiateProvider />
            <Toaster
              position='top-center'
              reverseOrder={false}
              gutter={8}
              containerClassName=''
              containerStyle={{}}
              toastOptions={{
                // Define default options
                className: '',
                duration: 5000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },

                // Default options for specific types
                success: {
                  duration: 3000,
                  theme: {
                    primary: 'green',
                    secondary: 'black',
                  },
                },
              }}
            />
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ApolloProvider>
  );
}

export default MyApp;
