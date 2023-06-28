import useGlobalStore from 'store';
import { ERC20, ERC20__factory } from 'types/ethers-contracts';
import { Address } from 'wagmi';

const useTokenContractInstance = ({
  tokenAddress,
}: {
  tokenAddress: Address;
}): ERC20 | null => {
  const { signer } = useGlobalStore();
  if (tokenAddress.length !== 42) {
    return null;
  }
  if (!signer) {
    return null;
  }
  return ERC20__factory.connect(tokenAddress, signer);
};

export default useTokenContractInstance;
