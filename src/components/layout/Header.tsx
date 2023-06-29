import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as React from 'react';

import Menu from '@/components/menus/index';

const sourceChainOptions: { name: string; value: string }[] = [
  {
    name: 'Ethereum',
    value: 'Ehereum',
  },
  {
    name: 'Bitcoin',
    value: 'Bitcoin',
  },
];

export default function Header() {
  return (
    <header className='z-50'>
      <div className='flex h-[10vh] w-full items-center justify-between px-10'>
        <span className='text-[36.65px]  font-bold leading-[46.18px] text-[#545454]'>
          FRAGMENTS
        </span>
        <div className=' flex space-x-4'>
          <ConnectButton />
          <Menu currentValue='Etherum' items={sourceChainOptions} />
        </div>
      </div>
    </header>
  );
}
