import { useQuery } from 'react-query';
import { goerli } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';

const getChain: Record<number, string> = {
  [goerli.id]:
    'https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-goerli/graphql?query=',
  [polygonMumbai.id]:
    'https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-mumbai/graphql?query=',
};

const originQuery = (transactionHash: string) => `query OriginTransfer {
  originTransfers(
    where: {
      transactionHash : "${transactionHash}"
    }
  ) {
    # Meta Data
    chainId
    nonce
    transferId
    to
    delegate
    receiveLocal
    callData
    slippage
    originSender
    originDomain
    destinationDomain
    transactionHash
    bridgedAmt
    status
    timestamp
    normalizedIn
    # Asset Data
    asset {
      id
      adoptedAsset
      canonicalId
      canonicalDomain
    }
  }
}`;

const destinationContractQuery = (transferId: string) => {
  return `query DestinationTransfer {
    destinationTransfers(
      where: {
        transferId : "${transferId}"
      }
    ) {
      # Meta Data
      chainId
      nonce
      transferId
      to
      callData
      originDomain
      destinationDomain
      delegate
      # Asset Data
      asset {
        id
      }
      bridgedAmt
      # Executed event Data
      status
      routers {
        id
      }
      originSender
      # Executed Transaction
      executedCaller
      executedTransactionHash
      executedTimestamp
      executedGasPrice
      executedGasLimit
      executedBlockNumber
      # Reconciled Transaction
      reconciledCaller
      reconciledTransactionHash
      reconciledTimestamp
      reconciledGasPrice
      reconciledGasLimit
      reconciledBlockNumber
      routersFee
      slippage
    }
  }`;
};
const useGetCrossChainData = ({
  chainId,
  transactionHash,
}: {
  chainId: number;
  transactionHash: string;
}) => {
  const createRequest = async (url: string, query: string) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    };
    const request = new Request(url, options);
    return fetch(request, {
      mode: 'cors',
    });
  };
  const fetchOriginTransfer = async () => {
    try {
      const url = getChain[chainId];
      if (!url) {
        return;
      }
      const res = await createRequest(url, originQuery(transactionHash));
      const data = await res.json();
      const transferId = data?.data?.originTransfers[0]?.transferId;
      return transferId;
    } catch (error) {
      return null;
    }
  };

  const fetchDestinationTransfer = async (transferId: string) => {
    try {
      const url = getChain[chainId];
      if (!url) {
        return;
      }
      const res = await createRequest(
        url,
        destinationContractQuery(transferId)
      );
      const data = await res.json();
      return data;
    } catch (error) {
      return null;
    }
  };

  return useQuery(['cross-chain-data'], async () => {
    if (!chainId) {
      throw new Error('No chainId provided');
    }
    if (!transactionHash) {
      throw new Error('No transactionHash provided');
    }
    const transferId = await fetchOriginTransfer();
    if (!transferId) {
      throw new Error('No transferId found');
    }
    const data = await fetchDestinationTransfer(transferId);
    debugger;
    if (!data) {
      throw new Error('No data found');
    }

    return data;
  });
};

export default useGetCrossChainData;
