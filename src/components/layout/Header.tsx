import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import * as React from 'react';

import useGetTreasuryBalance from '@/hooks/useGetTreasuryBalance';

export default function Header() {
  const balance = useGetTreasuryBalance();
  return (
    <header className='z-50'>
      <div className='flex w-full items-center justify-between px-4 py-6'>
        <Link href='/'>
          <div className='text-[36.65px]  font-bold leading-[46.18px] '>
            FRAGMENTS
          </div>
        </Link>

        <div className=' flex items-center space-x-4'>
          <Link href='/jobs' title='All Jobs' className='mr-2'>
            All Jobs
          </Link>
          <Link
            href='/balance'
            title='All Jobs'
            className='mr-2 rounded-lg border border-[#464646] bg-[#262229] px-2 py-2'
          >
            Balance ({balance} ETH)
          </Link>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
