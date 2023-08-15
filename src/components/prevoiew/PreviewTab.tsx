import React from 'react';
import useGlobalStore from 'store';
import { useAccount, useBalance, useNetwork } from 'wagmi';

import { TOKENS } from '@/config/tokens';

export enum AutomationArguments {
  FORWARD_PAYING_GAS = 'forwardpaying',
  PAY_FROM_GAS_ACCOUNT = 'gassaccount',
}

const PreviewTabMenu: React.FC<{
  gasMethods: AutomationArguments | null;
  setGasMethods: (value: AutomationArguments) => void;
}> = ({ gasMethods, setGasMethods }) => {
  const { sourceToken } = useGlobalStore();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data } = useBalance({
    address: address,
    token: sourceToken?.address,
  });

  const isForwardPayingGas = chain
    ? TOKENS[chain?.id].filter(
      (token) =>
        token.address.toLocaleLowerCase() ===
        sourceToken?.address.toLocaleLowerCase()
    )[0] ? TOKENS[chain?.id].filter(
      (token) =>
        token.address.toLocaleLowerCase() ===
        sourceToken?.address.toLocaleLowerCase()
    )[0].isForwardGasSupported : false
    : false;

  const options = [
    {
      id: 1,
      name: 'Forward paying gas ',
      isDisabled: isForwardPayingGas || data?.formatted === '0',
      value: AutomationArguments.FORWARD_PAYING_GAS,
    },
    {
      id: 2,
      name: 'Pay from gas account ',
      isDisabled: false || data?.formatted === '0',
      value: AutomationArguments.PAY_FROM_GAS_ACCOUNT,
    },
  ];

  return (
    <>
      {isForwardPayingGas && (
        <span className='mb-2 w-full text-center text-sm font-medium'>
          *{sourceToken?.name} is not supported for forwardpaying gas
        </span>
      )}
      <div className='mt-2 flex space-x-3 rounded-[16px] bg-[#373A40] p-2'>
        {options.map((option) => (
          <button
            key={option.value}
            className={`flex w-full flex-1  cursor-pointer items-center justify-center rounded-[12px] py-2  text-[16px] transition-all  duration-200 focus:outline-none ${gasMethods === option.value
                ? 'bg-[#0047CE] font-medium text-white'
                : 'bg-[#262229]  text-white'
              } ${option.isDisabled &&
              'disabled:cursor-not-allowed disabled:bg-[#262229] disabled:bg-opacity-50 disabled:text-opacity-20'
              }`}
            onClick={() => setGasMethods(option.value)}
            disabled={option.isDisabled}
          >
            {option.name}
          </button>
        ))}
      </div>
    </>
  );
};

export default PreviewTabMenu;
