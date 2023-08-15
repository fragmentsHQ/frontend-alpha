import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import * as React from 'react';
import useGlobalStore from 'store';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import clsxm from '@/lib/clsxm';

import TokenModal from '@/components/modal/TokenModal';
import Row from '@/components/rows/Row';

import { CHAIN_IMAGES, TOKENS } from '@/config/tokens';

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
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (chain?.id && sourceToken?.address) {
      const checkIfOnCorrectChain = TOKENS[chain.id].find((token) => token.address === sourceToken?.address);
      if (!checkIfOnCorrectChain) {
        setSourceToken(null)
      }
    }
  }, [chain])
  return (
    <React.Fragment>
      {chain && chain?.unsupported === false && (
        <TokenModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onTokenChange={(token) => {
            setSourceToken(token);
            setIsOpen(false);
          }}
          chainId={chain.id}
        />
      )}

      <Row className='gap-[30px] ' direction='row'>
        <Menu as='div' className='relative w-full'>
          <div className='mb-3 text-[16px] font-medium text-white'>
            Source Chain
          </div>
          <Menu.Button
            disabled={chain?.unsupported || !isConnected}
            className='align-left flex h-[50px] w-full items-center justify-between rounded-[10px] bg-[#262229] px-4 py-3 text-[18px] font-semibold disabled:cursor-not-allowed  '
          >
            <div className='font-semibold text-white'>
              <div className='flex items-center space-x-2'>
                {chain?.id && !chain.unsupported && (
                  <div className='relative h-[30px] w-[30px]'>
                    <Image
                      src={CHAIN_IMAGES[chain?.id].image_url}
                      alt={chain?.name || ''}
                      fill
                      className='rounded-full'
                    />
                  </div>
                )}

                <div>
                  {chain?.unsupported && (
                    <span className='text-[#FE494A]'>Unsupported chain</span>
                  )}
                  {!chain?.id && 'Connect your wallet'}
                  {chain?.id && !chain.unsupported && chain.name}
                </div>
              </div>
            </div>
            {!chain?.unsupported && chain && (
              <ChevronDownIcon
                className='-mr-1 ml-2 h-6 w-6 text-violet-200 hover:text-violet-100'
                aria-hidden='true'
              />
            )}
          </Menu.Button>
          <Menu.Items className='absolute right-0  mt-2 flex w-full origin-top-right flex-col overflow-hidden rounded-[10px] bg-[#262229] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {chains.map((option, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div
                    className={`${active && 'bg-[#282828]'
                      } relative z-20 flex w-full cursor-pointer items-center space-x-2 bg-[#262229] px-4 py-3 text-white`}
                    onClick={() => {
                      switchNetwork?.(option.id);
                    }}
                  >
                    {option.id && (
                      <div className={`relative h-[30px] w-[30px] `}>
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

        <div className='w-full'>
          <div className='mb-3 text-[16px] font-medium text-white'>
            Source Token
          </div>

          <button
            disabled={chain?.unsupported || !isConnected}
            className={clsxm(
              'align-left flex h-[50px] w-full items-center justify-between rounded-[10px] bg-[#262229] px-4 py-3 text-[18px] font-semibold disabled:cursor-not-allowed disabled:text-white disabled:text-opacity-40',
              !sourceToken && !chain?.unsupported && 'bg-[#0047CE]'
            )}
            onClick={() => {
              setIsOpen(true);
            }}
            type='button'
          >
            <div className='font-mormal '>
              {!sourceToken ? (
                'Select source token'
              ) : (
                <div className='flex items-center '>
                  <div className='relative mr-2 h-[30px] w-[30px]'>
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
              className='-mr-1 ml-2 h-6 w-6 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </button>
        </div>
      </Row>
    </React.Fragment>
  );
};

export default LandingMenu;
