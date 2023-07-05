import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
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
import { QueryClient, QueryClientProvider } from 'react-query';
import { configureChains, createClient, goerli, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

import InitiateProvider from '@/components/InitiateProvider';
import Seo from '@/components/Seo';

const endpoint1 = new HttpLink({
  uri: 'https://api.studio.thegraph.com/proxy/18071/fragments/version/latest',
});
const endpoint2 = new HttpLink({
  uri: 'https://api.studio.thegraph.com/query/47865/fragments-mumbai/v0.0.1',
});

//pass them to apollo-client config
export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === 'endpoint2',
    endpoint2, //if above
    endpoint1
  ),
  cache: new InMemoryCache(),
});

const { chains, provider, webSocketProvider } = configureChains(
  // [mainnet, polygonMumbai, goerli, gnosis, bsc, arbitrum, polygonZkEvm],
  [polygonMumbai, goerli],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: 'Fragments',
  chains,
});

const demoAppInfo = {
  appName: 'Fragments',
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

// const apolloClient = new ApolloClient({
//   uri: 'https://api.studio.thegraph.com/proxy/18071/fragments/version/latest',
//   cache: new InMemoryCache(),
// });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
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
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ApolloProvider>
  );
}

export default MyApp;
