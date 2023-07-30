import { TOKENS, Token } from '@/config/tokens';
import useGetTokenBalances from '@/hooks/useGetTokenBalances';
import clsxm from '@/lib/clsxm';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import {
  ComponentProps,
  Dispatch,
  Fragment,
  SetStateAction,
  use,
  useEffect,
  useState,
} from 'react';
import useGlobalStore from 'store';
import {
  useAccount,
  useBalance,
  useNetwork,
  useSwitchNetwork,
  useToken,
} from 'wagmi';

export default function TokenModal({
  isOpen,
  setIsOpen,
  onTokenChange,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onTokenChange: (token: Token) => void;
}) {
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);

  const { chain } = useNetwork();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    if (chain) {
      setFilteredTokens(TOKENS[chain?.id]);
    }
  }, []);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-3 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-[400px] transform overflow-hidden rounded-2xl bg-[#262229] text-left  align-middle shadow-xl transition-all '>
                <div className='flex items-center justify-between px-4 pt-4'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-white'
                  >
                    Select a token
                  </Dialog.Title>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent  p-1 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={closeModal}
                  >
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
                        d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </button>
                </div>

                <div className='mt-4 px-4'>
                  <div className='flex items-center justify-start rounded-xl border border-white px-2 text-white'>
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
                        d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                      />
                    </svg>
                    <input
                      placeholder='Search name'
                      onChange={(e) => {
                        const search = e.target.value;
                        if (!chain) return;
                        if (search.length > 0) {
                          setFilteredTokens(
                            TOKENS[chain?.id].filter((token) =>
                              token.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            )
                          );
                        } else {
                          setFilteredTokens(TOKENS[chain?.id]);
                        }
                      }}
                      className='ml-1 w-full bg-transparent px-2  py-2.5 focus:outline-none'
                    />
                  </div>
                </div>
                <div className='mt-6 h-[1px] w-full bg-white bg-opacity-20' />
                <div className='h-[350px] max-h-[350px] overflow-y-scroll'>
                  <div className='flex flex-col space-y-1 text-white'>
                    {filteredTokens.map((token, index) => (
                      <Token
                        token={token}
                        key={index}
                        onClick={() => {
                          onTokenChange(token);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

const Token: React.FC<
  ComponentProps<'div'> & {
    token: Token;
  }
> = ({ token, ...props }) => {
  const { address } = useAccount();
  const { data } = useBalance({
    address: address,
    token: token.address,
  });
  return (
    <div
      className='flex w-full cursor-pointer items-center justify-between space-x-4 px-4 py-2 hover:bg-white hover:bg-opacity-10 '
      {...props}
    >
      <div className='flex items-center'>
        <div className='relative mr-3 h-[40px] w-[40px] overflow-hidden rounded-full'>
          <Image src={token.image} fill alt={token.address} />
        </div>
        <div>
          <div className='text-base font-semibold'>{token?.name}</div>
          <div className='mt-1 text-xs'>{token?.symbol}</div>
        </div>
      </div>
      {data && <div>{parseFloat(data?.formatted as string).toFixed(4)}</div>}
    </div>
  );
};
