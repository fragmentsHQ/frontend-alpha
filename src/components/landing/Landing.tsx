import * as React from 'react';
import useGlobalStore from 'store';

import Card from '@/components/cards';
import Menu from '@/components/landing/LandingMenu';
import TabsMenu from '@/components/landing/Tab';
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
  } = useGlobalStore((state) => ({
    sourceToken: state.sourceToken,
    sourceChain: state.sourceChain,
    setSourceType: state.setSourceType,
    sourceType: state.sourceType,
    sourceTypeMode: state.sourceTypeMode,
    setSourceTypeMode: state.setSourceTypeMode,
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
                <TabsMenu options={tabMenus} onChange={setSourceType} />
              )}
            </div>
          </Card>
          {sourceType === 'Autopay' && sourceChain && sourceToken ? (
            <div className='flex w-[864px] justify-start'>
              <Card className='w-[300px] bg-[#282828] p-[20px] shadow-none'>
                <TabsMenu
                  options={autoplayItems}
                  onChange={setSourceTypeMode}
                />
              </Card>
            </div>
          ) : (
            <div></div>
          )}

          <div>
            {sourceTypeMode === 'Onetime' &&
            sourceType === 'Autopay' &&
            sourceChain &&
            sourceToken ? (
              <Card className='w-[864px] bg-[#282828] p-[26px] shadow-none'>
                <TabsMenu options={oneTimeItems} />
              </Card>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </Row>
    </React.Fragment>
  );
};

export default Landing;
