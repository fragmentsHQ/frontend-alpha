import { readContract } from '@wagmi/core';
import { BigNumber } from 'alchemy-sdk';
import { useQuery } from 'react-query';
import { useNetwork } from 'wagmi';

import { AUTOPAY_CONTRACT_ADDRESSES } from '@/config/contracts';

import AutoPayAbi from '../abi/Autopay.json';

const useCheckIfValidJob = ({ job_id }: { job_id: string }) => {
  const { chain } = useNetwork();

  const checkStatus = async () => {
    try {
      if (!chain) return;
      if (!job_id) return;
      const data = await readContract({
        address:
          AUTOPAY_CONTRACT_ADDRESSES[chain?.testnet ? 'testnets' : 'mainnet'][
            chain?.id
          ],
        abi: AutoPayAbi.abi,
        functionName: '_createdJobs',
        args: [job_id],
      });
      const isCancellable =
        data[0] === '0x0000000000000000000000000000000000000000';
      const isCompleted = BigNumber.from(data[1]).eq(BigNumber.from(data[2]));
      const execution = BigNumber.from(data[2]).toString();
      return {
        isCancellable,
        execution,
        isCompleted,
      };
    } catch (error) {
      return {
        execution: '0',
        isCompleted: false,
      };
    }
  };

  return useQuery(['checkIfValidJob', job_id], () => {
    return checkStatus();
  });
};

export default useCheckIfValidJob;
