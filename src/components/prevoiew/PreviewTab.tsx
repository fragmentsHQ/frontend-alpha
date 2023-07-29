import React from 'react';
import useGlobalStore from 'store';

export enum AutomationArguments {
  FORWARD_PAYING_GAS = 'forwardpaying',
  PAY_FROM_GAS_ACCOUNT = 'gassaccount',
}

const options = [
  {
    id: 1,
    name: 'Forward paying gas ',
    isDisabled: false,
    value: AutomationArguments.FORWARD_PAYING_GAS,
  },
  {
    id: 2,
    name: 'Pay from gas account ',
    isDisabled: false,
    value: AutomationArguments.PAY_FROM_GAS_ACCOUNT,
  },
];

const PreviewTabMenu: React.FC<{
  gasMethods: AutomationArguments | null;
  setGasMethods: (value: AutomationArguments) => void;
}> = ({ gasMethods, setGasMethods }) => {
  return (
    <div className='flex space-x-3 rounded-[16px] bg-[#373A40] p-2'>
      {options.map((option) => (
        <button
          key={option.value}
          className={`flex w-full flex-1  cursor-pointer items-center justify-center rounded-[12px] py-2  text-[16px] transition-all  duration-200 focus:outline-none ${
            gasMethods === option.value
              ? 'bg-[#0047CE] font-medium text-white'
              : 'bg-[#262229]  text-white'
          } ${
            option.isDisabled &&
            'disabled:cursor-not-allowed disabled:bg-[#262229] disabled:bg-opacity-50 disabled:text-opacity-20'
          }`}
          onClick={() => setGasMethods(option.value)}
          disabled={option.isDisabled}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default PreviewTabMenu;
