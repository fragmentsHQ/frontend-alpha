import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useChainId } from 'wagmi';

import Card from '@/components/cards';
import { TokenRow } from '@/components/inputs/input';

import { Token, tokens } from '@/config/tokens';

export default function TokenSelect({
  selected,
  setSelected,
  removeToken,
}: {
  selected: Token;
  removeToken?: Token;
  setSelected: (token: Token) => void;
}) {
  const chainId = useChainId();
  return (
    <div className='h-full w-full'>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative h-full'>
          <Listbox.Button className='  relative h-full w-full  cursor-default focus:outline-none  sm:text-sm'>
            <TokenRow tokenName={selected.symbol} imageurl={selected.image} />
            <div className='absolute right-2  top-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                />
              </svg>
            </div>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto py-1 text-base  focus:outline-none sm:text-sm'>
              <Card>
                {tokens[chainId]
                  .filter((token) => token.address !== removeToken?.address)
                  .map((token, tokenIdx) => (
                    <Listbox.Option key={tokenIdx} value={token}>
                      {({ active }) => (
                        <TokenRow
                          imageurl={token.image}
                          size='sm'
                          className={`py-3 ${
                            active
                              ? 'rounded-none bg-white bg-opacity-10 '
                              : 'text-white'
                          }`}
                          tokenName={token.symbol}
                        />
                      )}
                    </Listbox.Option>
                  ))}
              </Card>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
