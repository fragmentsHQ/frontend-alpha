import { goerli, polygon, polygonMumbai } from 'wagmi/chains';

export const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  [goerli.id]:
    'https://api.studio.thegraph.com/proxy/47865/fragments-graph/version/latest',
  [polygon.id]:
    'https://api.studio.thegraph.com/proxy/47865/fragments-polygon/version/latest',
  [polygonMumbai.id]:
    'https://api.studio.thegraph.com/proxy/47865/fragments-mumbai/version/latest',
};
