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
const autoplayItems = [
  {
    name: 'Conditional(one time)',
    value: 'Onetime',
  },
  {
    name: 'Recurring',
    value: 'Recurring',
  },
];

const Landing: React.FC = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const [selectedTriggerValue, setTriggerValue] = React.useState<null | number>(
    null
  );
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
      <div className='flex items-center justify-center'>
        <div className=''>
          <p className='mb-6 mt-20 text-center text-[24px] font-bold leading-[29.05px] text-white '>
            The Fragments way of automating smart contracts{' '}
          </p>
          <Card className='mx-auto w-[864px] bg-[#272E3C] p-[26px] shadow-none'>
            <Menu />
            <div className='mt-4'>
              {isConnected &&
                chain?.id &&
                !chain?.unsupported &&
                sourceToken?.name && (
                  <TabsMenu
                    options={tabMenus}
                    onChange={setSourceType}
                    currentTab={sourceType}
                  />
                )}
            </div>
          </Card>
          {isConnected &&
          sourceType === 'Autopay' &&
          chain?.id &&
          !chain?.unsupported &&
          sourceToken?.name ? (
            <div className='mx-auto flex w-[864px] justify-center'>
              <Card className='mt-6 w-[400px] bg-[#373A40] shadow-none'>
                <TabsMenu
                  options={autoplayItems}
                  onChange={setSourceTypeMode}
                  currentTab={sourceTypeMode}
                />
              </Card>
            </div>
          ) : (
            <div></div>
          )}

          <div className='flex items-center justify-center'>
            {isConnected &&
              (sourceTypeMode === 'Onetime' ||
                sourceTypeMode === 'Recurring') &&
              sourceType === 'Autopay' &&
              !chain?.unsupported &&
              chain?.id &&
              sourceToken && (
                <Card
                  className={clsxm(
                    'mt-6 flex space-x-3 bg-[#373A40] p-[10px] shadow-none',
                    sourceTypeMode !== 'Recurring'
                      ? 'w-[864px]'
                      : 'w-[300px] justify-center'
                  )}
                >
                  {TriggerValues.slice(
                    0,
                    sourceTypeMode === 'Recurring' ? 1 : TriggerValues.length
                  ).map((value, index) => {
                    return (
                      <div key={index} className='flex w-full  space-x-3 '>
                        <a
                          className={`${
                            selectedTriggerValue === value.id
                              ? 'bg-[#0047CE] font-medium text-white'
                              : 'bg-[#232323] text-white'
                          } flex w-full flex-1  cursor-pointer items-center justify-center rounded-[12px] py-2  text-[16px] transition-all  duration-200 focus:outline-none`}
                          onClick={() => setTriggerValue(value.id)}
                        >
                          {value.name}
                        </a>
                      </div>
                    );
                  })}
                </Card>
              )}
          </div>
          {isConnected &&
            sourceType === 'Autopay' &&
            sourceTypeMode === 'Recurring' &&
            chain?.id &&
            !chain?.unsupported &&
            selectedTriggerValue &&
            TriggerValues[0].component}
          {isConnected &&
            sourceType === 'Autopay' &&
            sourceTypeMode !== 'Recurring' &&
            chain?.id &&
            !chain?.unsupported &&
            selectedTriggerValue &&
            TriggerValues.filter((f) => f.id === selectedTriggerValue)[0]
              .component}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Landing;
