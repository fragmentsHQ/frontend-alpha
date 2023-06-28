import { ethers } from 'ethers';
import { useEffect } from 'react';
import useGlobalStore from 'store';
import { useAccount, useNetwork } from 'wagmi';

export const InitiateProvider = () => {
  const { address } = useAccount();
  const { setSigner } = useGlobalStore((state) => state);
  const { chain } = useNetwork();

  useEffect(() => {
    (async () => {
      if ((!address && !chain) || chain?.unsupported) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.ethereum as any
      );
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      if (
        provider &&
        address &&
        (await provider.getNetwork()).chainId === chain?.id
      ) {
        setSigner(signer);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, address]);

  return null;
};

export default InitiateProvider;
