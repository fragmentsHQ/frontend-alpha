import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as React from 'react';
import useGlobalStore from 'store';

const sourceChainOptions: { name: string; value: string; icon: string }[] = [
  {
    name: 'Ethereum',
    value: 'Ehereum',
    icon: 'https://img.icons8.com/?size=512&id=50284&format=png',
  },
  {
    name: 'Bitcoin',
    value: 'Bitcoin',
    icon: 'https://img.icons8.com/?size=512&id=63192&format=png',
  },
];

export default function Header() {
  const { currency, setCurrency } = useGlobalStore((state) => ({
    currency: state.currency,
    setCurrency: state.setCurrency,
  }));
  return (
    <header className='z-50'>
      <div className='flex h-[10vh] w-full items-center justify-between px-10'>
        <div className='text-[36.65px]  font-bold leading-[46.18px] text-[#545454]'>
          FRAGMENTS
        </div>
        <div className=' flex space-x-4'>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
