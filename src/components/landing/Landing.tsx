import * as React from 'react';
import useGlobalStore from 'store';

import Card from '@/components/cards';
import Menu from '@/components/landing/LandingMenu';

const Landing: React.FC = () => {
  const { sourceToken, sourceChain } = useGlobalStore((state) => ({
    sourceToken: state.sourceToken,
    sourceChain: state.sourceChain,
  }));
  return (
    <React.Fragment>
      <div
        className={`relative flex h-[90vh] flex-col ${
          sourceChain && sourceToken ? 'pt-20' : 'items-center justify-center'
        }  space-y-4`}
      >
        <p className='flex w-[864px] justify-start text-[24px] font-bold leading-[29.05px] text-white '>
          The Fragments way of automating smart contracts{' '}
        </p>
        <Card className='w-[864px] bg-[#282828] p-[26px] text-black shadow-none'>
          <Menu />
          {sourceToken && sourceChain && <div>Hello</div>}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Landing;
