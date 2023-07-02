const options = [
  {
    id: 1,
    name: 'Forward paying gas ',
    value: 'forwardpaying',
  },
  {
    id: 2,
    name: 'Pay from gas account ',
    value: 'gassaccount',
  },
];

import React from 'react';
import useGlobalStore from 'store';

const PreviewTabMenu: React.FC = () => {
  const { paymentMethod, setPaymentMethod } = useGlobalStore((state) => ({
    paymentMethod: state.paymentMethod,
    setPaymentMethod: state.setPaymentMethod,
  }));
  return (
    <div className='flex space-x-3 rounded-[16px] bg-[#373A40] p-2'>
      {options.map((option) => (
        <a
          key={option.value}
          className={`flex w-full flex-1  cursor-pointer items-center justify-center rounded-[12px] py-2  text-[16px] transition-all  duration-200 focus:outline-none ${
            paymentMethod === option.value
              ? 'bg-[#0047CE] font-medium text-white'
              : 'bg-[#262229]  text-white'
          }`}
          onClick={() => setPaymentMethod(option.value)}
        >
          {option.name}
        </a>
      ))}
    </div>
  );
};

export default PreviewTabMenu;
