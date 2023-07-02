import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as React from 'react';

export default function Header() {
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
