import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { getNetwork } from '@wagmi/core';
import { polygon } from 'wagmi/chains';

import { CHAIN_SUBGRAPH_URL } from '@/config/chains';

const httpLink = new HttpLink({ uri: CHAIN_SUBGRAPH_URL[polygon.id] });

// This middleware will allow us to dynamically update the uri for the requests based off chainId
// For more information: https://www.apollographql.com/docs/react/networking/advanced-http-networking/
const authMiddleware = new ApolloLink((operation, forward) => {
  const { chain } = getNetwork();
  const chainId = chain?.id;
  operation.setContext(() => ({
    uri:
      chainId && CHAIN_SUBGRAPH_URL[chainId]
        ? CHAIN_SUBGRAPH_URL[chainId]
        : CHAIN_SUBGRAPH_URL[polygon.id],
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});
