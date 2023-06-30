import * as React from 'react';
import useGlobalStore from 'store';

import Card from '@/components/cards';
import Menu from '@/components/landing/LandingMenu';
import TabsMenu from '@/components/landing/Tab';
import ErrorModal from '@/components/loading/Failed';
import PreviewReview from '@/components/prevoiew/Previewreview';
import Row from '@/components/rows/Row';

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

const oneTimeItems = [
  { name: 'Time', value: 'Time' },
  { name: 'Token Pair Price', value: 'Token Pair Price' },
  { name: 'Gas Price Estimate', value: 'Gas Price Estimate' },
  { name: 'ABI Functions', value: 'ABI Functions' },
];

const Landing: React.FC = () => {
  const {
    sourceToken,
    sourceChain,
    setSourceType,
    sourceType,
    sourceTypeMode,
    setSourceTypeMode,
    onetimeSubOption,
    setOnetimeSubOption,
    recurringSubOption,
    setRecurringSubOption,
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
      <Row className=' ' isCentered={true}>
        <div
          className={`relative flex ${
            (!sourceToken || !sourceChain) && 'h-[90vh]'
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
              {sourceToken && sourceChain && (
                <TabsMenu
                  options={tabMenus}
                  onChange={setSourceType}
                  currentTab={sourceType}
                />
              )}
            </div>
          </Card>
          {sourceType === 'Autopay' && sourceChain && sourceToken ? (
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
            {(sourceTypeMode === 'Onetime' || sourceTypeMode === 'Recurring') &&
              sourceType === 'Autopay' &&
              sourceChain &&
              sourceToken && (
                <Card className='w-[864px] bg-[#282828] p-[26px] shadow-none'>
                  <TabsMenu
                    options={oneTimeItems}
                    onChange={
                      sourceTypeMode === 'Onetime'
                        ? setOnetimeSubOption
                        : setRecurringSubOption
                    }
                    currentTab={
                      sourceTypeMode === 'Onetime'
                        ? onetimeSubOption
                        : recurringSubOption
                    }
                  />
                </Card>
              )}
          </div>
          <ErrorModal isOpen={true} />
          <PreviewReview />
        </div>
      </Row>
    </React.Fragment>
  );
};

export default Landing;
