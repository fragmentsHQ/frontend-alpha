import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import * as React from 'react';

export default function Header() {
  return (
    <header className='z-50'>
      <div className='flex w-full items-center justify-between px-4 py-6'>
        <div className='text-[36.65px]  font-bold leading-[46.18px] '>
          FRAGMENTS
        </div>

        <div className=' flex items-center space-x-4'>
          <Link href='/jobs' title='All Jobs' className='mr-2'>
            All Jobs
          </Link>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
