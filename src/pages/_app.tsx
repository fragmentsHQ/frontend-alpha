import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import InitiateProvider from '@/components/InitiateProvider';
import Seo from '@/components/Seo';
import WalletConfiguration from '@/components/WalletConfiguration';

const endpoint1 = new HttpLink({
  uri: 'https://api.studio.thegraph.com/proxy/47865/fragments-graph/version/latest',
});
const endpoint2 = new HttpLink({
  uri: 'https://api.studio.thegraph.com/proxy/47865/fragments-mumbai/version/latest',
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

const queryClient = new QueryClient();

// const apolloClient = new ApolloClient({
//   uri: 'https://api.studio.thegraph.com/proxy/18071/fragments/version/latest',
//   cache: new InMemoryCache(),
// });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <WalletConfiguration>
          <Seo />
          <InitiateProvider />
          <Component {...pageProps} />
        </WalletConfiguration>
      </QueryClientProvider>
    </ApolloProvider>
  );
}

export default MyApp;
