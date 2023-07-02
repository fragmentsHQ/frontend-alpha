import React from 'react';
import useGlobalStore from 'store';

import Card from '@/components/cards';
import PreviewTabMenu from '@/components/prevoiew/PreviewTab';

const PreviewReview = ({ onClick }: { onClick: () => void }) => {
  const { paymentMethod } = useGlobalStore();
  return (
    <div>
      <Card className='flex w-[864px] flex-col space-y-10 bg-[#272E3C] p-[26px] shadow-none'>
        <p className='flex w-full justify-center text-[18px] font-normal leading-[28px] text-white'>
          Choose how the task should be paid for. The cost of each execution
          equals the network fee.
        </p>

        <PreviewTabMenu />

        <div className=' flex justify-center space-x-3'>
          <button
            onClick={onClick}
            disabled={!paymentMethod}
            className='rounded-[12px] bg-[#0047CE] px-20 py-3 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#262229] disabled:bg-opacity-50 disabled:text-opacity-20'
          >
            {' '}
            Confirm Token Allowance
          </button>
          <button
            onClick={onClick}
            disabled={!paymentMethod}
            className='rounded-[12px] bg-[#0047CE] px-20 py-3 text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#262229] disabled:bg-[#464646] disabled:bg-opacity-50 disabled:text-opacity-20'
          >
            {' '}
            Confirm by signing
          </button>
        </div>
      </Card>
    </div>
  );
};

export default PreviewReview;
