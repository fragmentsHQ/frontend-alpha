import { NextApiRequest, NextApiResponse } from 'next';

import { destinationContractQuery, originQuery } from '@/queries';
export const getChain: Record<number, string> = {
  [5]: 'https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-goerli',
  [80001]:
    'https://api.thegraph.com/subgraphs/name/connext/nxtp-amarok-runtime-v0-mumbai',
};

export default async function fetchCrossChainData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  const { chain_id } = req.body;
  const { transaction_hash } = req.body;
  console.log(chain_id);
  console.log(transaction_hash);
  res.status(200).json({ transferId: '' });

  const getTransferId = await fetch(getChain[chain_id as number], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: originQuery(transaction_hash as string),
    }),
  });
  const transferData = await getTransferId.json();
  const transferId = transferData.data.originTransfers[0].transferId;
  console.log(transferId);
  const getDestinationData = await fetch(getChain[chain_id as number], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: destinationContractQuery(transferId as string),
    }),
  });
  const destinationData = await getDestinationData.json();
  res.status(200).json({ transferId });
}
