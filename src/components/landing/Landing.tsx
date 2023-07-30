import * as React from 'react';
import useGlobalStore from 'store';
import { useAccount, useNetwork } from 'wagmi';

import Card from '@/components/cards';
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
      <div className='mx-auto flex w-full max-w-[75%] flex-col space-y-6'>
        <p className='mb-6 mt-20 text-center text-[24px] font-bold leading-[29.05px] text-white '>
          The Fragments way of automating smart contracts{' '}
        </p>
        <TabsMenu
          options={tabMenus}
          onChange={setSourceType}
          currentTab={sourceType}
        />
        {TriggerValues[0].component}
      </div>
    </React.Fragment>
  );
};

export default Landing;
