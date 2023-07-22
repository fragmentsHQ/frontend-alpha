import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import * as React from 'react';
import useGlobalStore from 'store';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import Row from '@/components/rows/Row';

import { CHAIN_IMAGES, Token, TOKENS } from '@/config/tokens';

export const getLogo = (name: string | undefined) => {
  switch (name) {
    case 'Ethereum':
      return 'https://img.icons8.com/color/50/000000/ethereum.png';
    case 'Bitcoin':
      return 'https://img.icons8.com/color/50/000000/bitcoin.png';
    default:
      return 'https://img.icons8.com/color/50/000000/ethereum.png';
  }
};

const LandingMenu = () => {
  const { isConnected } = useAccount();
  const { sourceToken, setSourceToken } = useGlobalStore();
  const { switchNetwork } = useSwitchNetwork();
  const { chains, chain } = useNetwork();

  return (
    <React.Fragment>
      <Row className='gap-[30px] ' direction='row'>
        <Menu as='div' className='relative w-full'>
          <div className='mb-1 text-[18px] font-medium text-white'>
            Source Chain
          </div>
          <Menu.Button
            disabled={chain?.unsupported || !isConnected}
            className='align-left flex w-full items-center justify-between rounded-[10px] bg-[#262229] px-5 py-2 text-[18px] disabled:cursor-not-allowed  '
          >
            <div className='font-normal text-white'>
              <div className='flex items-center space-x-2'>
                {chain?.id && !chain.unsupported && (
                  <div className='relative h-[20px] w-[20px]'>
                    <Image
                      src={CHAIN_IMAGES[chain?.id].image_url}
                      alt={chain?.name || ''}
                      fill
                      className='rounded-full'
                    />
                  </div>
                )}

                <div>
                  {chain?.unsupported && 'Unsupported chain'}
                  {!chain?.id && 'Connect your wallet'}
                  {chain?.id && !chain.unsupported && chain.name}
                </div>
              </div>
            </div>
            <ChevronDownIcon
              className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
          <Menu.Items className='absolute right-0 mt-2 flex w-full origin-top-right flex-col rounded-md bg-[#262229] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {chains.map((option, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div
                    className={`${
                      active && 'bg-[#282828]'
                    } flex w-full cursor-pointer items-center space-x-2 px-4 py-2 text-white`}
                    onClick={() => {
                      switchNetwork?.(option.id);
                    }}
                  >
                    {option.id && (
                      <div className={`relative h-[20px] w-[20px] `}>
                        <Image
                          src={CHAIN_IMAGES[option.id].image_url}
                          alt={option.name || ''}
                          fill
                          className='rounded-full'
                        />
                      </div>
                    )}

                    <div>{option.name}</div>
                  </div>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>

        <Menu as='div' className='relative w-full'>
          <div className='mb-1 text-[18px] font-medium text-white'>
            Source Token
          </div>

          <Menu.Button
            disabled={chain?.unsupported || !isConnected}
            className='align-left flex w-full items-center justify-between rounded-[10px] bg-[#262229] px-5 py-2 text-[18px] disabled:cursor-not-allowed'
          >
            <div className='font-mormal text-white'>
              {!sourceToken ? (
                'Select your token'
              ) : (
                <div className='flex items-center '>
                  <div className='relative mr-2 h-[20px] w-[20px]'>
                    <Image
                      src={sourceToken.image}
                      alt={sourceToken.name || ''}
                      fill
                      className='rounded-full'
                    />
                  </div>
                  {sourceToken.name}
                </div>
              )}
            </div>
            <ChevronDownIcon
              className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
          <Menu.Items className='absolute right-0  mt-2 flex w-full origin-top-right flex-col rounded-md bg-[#262229] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {chain?.id &&
              !chain.unsupported &&
              TOKENS[chain?.id].map((option, index: number) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <p
                      className={`${
                        active && 'bg-[#282828]'
                      } relative z-20 flex w-full cursor-pointer items-center space-x-2 rounded-lg bg-[#262229] px-4 py-2 text-white`}
                      onClick={() => setSourceToken(option as Token)}
                    >
                      {option.image && (
                        <div className={`relative h-[20px] w-[20px] `}>
                          <Image
                            src={option.image}
                            alt={option.name || ''}
                            fill
                            className='rounded-full'
                          />
                        </div>
                      )}

                      <div>{option.name}</div>
                    </p>
                  )}
                </Menu.Item>
              ))}
          </Menu.Items>
        </Menu>
      </Row>
    </React.Fragment>
  );
};

export default LandingMenu;
