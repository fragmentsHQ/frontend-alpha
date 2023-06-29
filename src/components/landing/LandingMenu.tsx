import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import * as React from 'react';

import Row from '@/components/rows/Row';

import useGlobalStore from '../../../store/index';

type MenuOptions = {
  name: string;
  value: string;
};

const LandingMenu: React.FC = () => {
  const { sourceToken, sourceChain, setSourceChain, setSourceToken } =
    useGlobalStore((state) => ({
      sourceToken: state.sourceToken,
      sourceChain: state.sourceChain,
      setSourceChain: state.setSourceChain,
      setSourceToken: state.setSourceToken,
    }));

  const sourceTokenOptions: MenuOptions[] = [
    {
      name: 'ETH',
      value: 'ETH',
    },
    {
      name: 'BTC',
      value: 'BTC',
    },
  ];
  const sourceChainOptions: MenuOptions[] = [
    {
      name: 'Ethereum',
      value: 'Ehereum',
    },
    {
      name: 'Bitcoin',
      value: 'Bitcoin',
    },
  ];

  return (
    <React.Fragment>
      <Row className='gap-[30px] ' direction='row'>
        <Menu as='div' className='relative w-full'>
          <div className='mb-1 text-[18px] font-medium text-white'>
            Source Chian
          </div>
          <Menu.Button className='align-left flex w-full items-center justify-between rounded-[10px] bg-[#262229] px-5 py-2 text-[18px]  '>
            <span className='font-normal text-white'>
              {sourceChain === null ? 'Selection' : sourceChain}
            </span>
            <ChevronDownIcon
              className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
          <Menu.Items className='absolute right-0 mt-2 flex w-full origin-top-right flex-col rounded-md bg-[#262229] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {sourceChainOptions.map((option: MenuOptions, index: number) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <a
                    className={`${
                      active && 'bg-[#282828] '
                    } cursor-pointer px-4 py-2 text-white`}
                    onClick={() => setSourceChain(option.value)}
                  >
                    {option.name}
                  </a>
                )}
              </Menu.Item>
            ))}
            {/* <Menu.Item>Menu Item 2</Menu.Item>
              <Menu.Item>Menu Item 3</Menu.Item> */}
          </Menu.Items>
        </Menu>

        <Menu as='div' className='relative w-full'>
          <div className='mb-1 text-[18px] font-medium text-white'>
            Source Token
          </div>

          <Menu.Button className='align-left flex w-full items-center justify-between rounded-[10px] bg-[#262229] px-5 py-2 text-[18px]'>
            <span className='font-mormal text-white'>
              {sourceToken === null ? 'Selection' : sourceToken}
            </span>
            <ChevronDownIcon
              className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
          <Menu.Items className='absolute right-0 mt-2 flex w-full origin-top-right flex-col rounded-md bg-[#262229] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {sourceTokenOptions.map((option: MenuOptions, index: number) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <a
                    className={`${
                      active && 'bg-[#282828] '
                    } cursor-pointer px-4 py-2 text-white`}
                    onClick={() => setSourceToken(option.value)}
                  >
                    {option.name}
                  </a>
                )}
              </Menu.Item>
            ))}
            {/* <Menu.Item>Menu Item 2</Menu.Item>
              <Menu.Item>Menu Item 3</Menu.Item> */}
          </Menu.Items>
        </Menu>
      </Row>
    </React.Fragment>
  );
};

export default LandingMenu;