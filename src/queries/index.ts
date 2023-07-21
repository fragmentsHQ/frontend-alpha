export const destinationContractQuery = (transferId: string) => {
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

export const originQuery = (transactionHash: string) => `{
  originTransfers(
    where: {
      transactionHash : "${transactionHash}"
    }
  ) {
    chainId
    nonce
    transferId
  }
}`;
