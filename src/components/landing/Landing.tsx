import * as React from 'react';
import useGlobalStore from 'store';
import { useAccount, useNetwork } from 'wagmi';

import Card from '@/components/cards';
import Menu from '@/components/landing/LandingMenu';
import TabsMenu from '@/components/landing/Tab';
import ErrorModal from '@/components/loading/Failed';
import Row from '@/components/rows/Row';

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
    name: 'One-time',
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
    sourceChain,
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
      <ErrorModal isOpen={false} />
      <Row className=' ' isCentered={true}>
        <div
          className={`relative flex ${
            (!sourceToken || !sourceChain) && 'min-h-[90vh]'
          }  flex-col ${
            sourceChain && sourceToken ? 'pt-20' : 'items-center justify-center'
          }  space-y-4`}
        >
          <p className='flex w-[864px] justify-start text-[24px] font-bold leading-[29.05px] text-white '>
            The Fragments way of automating smart contracts{' '}
          </p>
          <Card className='w-[864px] bg-[#282828] p-[26px] shadow-none'>
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
            <div className='flex w-[864px] justify-start'>
              <Card className='w-[300px] bg-[#282828] p-[20px] shadow-none'>
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

          <div>
            {isConnected &&
              (sourceTypeMode === 'Onetime' ||
                sourceTypeMode === 'Recurring') &&
              sourceType === 'Autopay' &&
              !chain?.unsupported &&
              chain?.id &&
              sourceToken && (
                <Card className='flex w-[864px] space-x-3 bg-[#282828] p-[26px] shadow-none'>
                  {TriggerValues.map((value, index) => {
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
            chain?.id &&
            !chain?.unsupported &&
            selectedTriggerValue &&
            TriggerValues.filter((f) => f.id === selectedTriggerValue)[0]
              .component}
        </div>
      </Row>
    </React.Fragment>
  );
};

export default Landing;
