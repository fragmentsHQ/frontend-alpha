import { useQuery } from 'react-query';
import useGlobalStore from 'store';
import { ERC20__factory } from 'types/ethers-contracts';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

const useGetTokenBalances = ({
  tokenContractAddress,
}: {
  tokenContractAddress: Address;
}) => {
  const { address } = useAccount();
  const { signer } = useGlobalStore();
  return useQuery(
    [tokenContractAddress + '-user-balance'],
    async () => {
      if (tokenContractAddress.length !== 42) {
        return 0;
      }
      if (!address || !signer) {
        return 0;
      }
      const token = ERC20__factory.connect(tokenContractAddress, signer);
      const decimal = await token.decimals();
      const balanceof = await token.balanceOf(address);
      const hexValue = balanceof._hex;
      const decimalValue = BigInt(hexValue as string);
      const ethValue = decimalValue / BigInt(10 ** decimal);
      return ethValue;
    },
    {
      enabled: !!signer,
    }
  );
};

export default useGetTokenBalances;
