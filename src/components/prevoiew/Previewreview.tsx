import React from 'react';

import Card from '@/components/cards';
import PreviewTabMenu from '@/components/prevoiew/PreviewTab';

const PreviewReview: React.FC = () => {
  return (
    <div>
      <Card className='flex w-[864px] flex-col space-y-10 bg-[#282828] p-[26px] shadow-none'>
        <p className='flex w-full justify-center text-[18px] font-normal leading-[28px] text-white'>
          Choose how the task should be paid for. The cost of each execution
          equals the network fee.
        </p>

        <PreviewTabMenu />

        <div className=' flex justify-center'>
          <button className='rounded-[12px] bg-[#0047CE] px-20 py-3 text-[16px] font-semibold text-white'>
            {' '}
            Preview and Confirm
          </button>
        </div>
      </Card>
    </div>
  );
};

export default PreviewReview;
