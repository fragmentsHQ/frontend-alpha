import * as React from 'react';
import useGlobalStore from 'store';
import { useAccount, useNetwork } from 'wagmi';

import clsxm from '@/lib/clsxm';

import Card from '@/components/cards';
import Menu from '@/components/landing/LandingMenu';
import TabsMenu from '@/components/landing/Tab';

import { TriggerValues } from '@/pages';

const tabMenus = [
  {
    name: 'Autopay',
    value: 'Autopay',
  },
  {
    name: 'XStream',
    value: 'XStream',
  },
];

const Landing: React.FC = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const {
    sourceToken,
    setSourceType,
    sourceType,
    sourceTypeMode,
    setSourceTypeMode,
  } = useGlobalStore((state) => ({
    sourceToken: state.sourceToken,
    sourceChain: state.sourceChain,
    setSourceType: state.setSourceType,
    sourceType: state.sourceType,
    sourceTypeMode: state.sourceTypeMode,
    setSourceTypeMode: state.setSourceTypeMode,
    onetimeSubOption: state.onetimeSubOption,
    setOnetimeSubOption: state.setOneTimeSubOption,
    recurringSubOption: state.recurringSubOption,
    setRecurringSubOption: state.setRecurringSubOption,
  }));

  return (
    <React.Fragment>
      <div className='mx-auto flex w-full flex-col space-y-6'>
        <p className='mb-6 mt-20 text-center text-[24px] font-bold leading-[29.05px] text-white '>
          The Fragments way of automating smart contracts{' '}
        </p>
        <TabsMenu
          options={tabMenus}
          onChange={setSourceType}
          currentTab={sourceType}
        />
        <Card className='mx-auto  w-[50%] bg-[#272E3C] p-4 shadow-none'>
          <Menu />
        </Card>
        {isConnected &&
          chain?.id &&
          !chain?.unsupported &&
          TriggerValues[0].component}
      </div>
    </React.Fragment>
  );
};

export default Landing;
