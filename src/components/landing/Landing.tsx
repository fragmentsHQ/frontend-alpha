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
    value: 'one-time',
  },
  {
    name: 'Recurring',
    value: 'Recurring',
  },
];

const Landing: React.FC = () => {
  const { sourceToken, sourceChain, setSourceType, sourceType } =
    useGlobalStore((state) => ({
      sourceToken: state.sourceToken,
      sourceChain: state.sourceChain,
      setSourceType: state.setSourceType,
      sourceType: state.sourceType,
    }));

  return (
    <React.Fragment>
      <Row className=' ' isCentered={true}>
        <div
          className={`relative flex h-[90vh] flex-col ${
            sourceChain && sourceToken ? 'pt-20' : 'items-center justify-center'
          }  space-y-4`}
        >
          <p className='flex w-[864px] justify-start text-[24px] font-bold leading-[29.05px] text-white '>
            The Fragments way of automating smart contracts{' '}
          </p>
          <Card className='w-[864px] bg-[#282828] p-[26px] shadow-none'>
            <Menu />
            {sourceToken && sourceChain && (
              <TabsMenu
                options={tabMenus}
                onChange={setSourceType}
                listBg='[#464646]'
                tabBg='[#0047CE]'
                tabText='white'
                marTop='4'
              />
            )}
          </Card>
          {sourceType === 'Autopay' && sourceChain && sourceToken ? (
            <div className='flex w-[864px] justify-start'>
              <Card className='w-[300px] bg-[#282828] p-[20px] shadow-none'>
                <TabsMenu
                  options={autoplayItems}
                  listBg='[#464646]'
                  tabBg='[#0047CE]'
                  tabText='white'
                  isDifferentSubTabColor={true}
                  optionBgColor='[#2E2E2E]'
                />
              </Card>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </Row>
    </React.Fragment>
  );
};

export default Landing;
