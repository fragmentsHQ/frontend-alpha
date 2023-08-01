import Link from 'next/link';
import * as React from 'react';
import { Web3Button } from '@web3modal/react';

import useGetTreasuryBalance from '@/hooks/useGetTreasuryBalance';
import { useNetwork } from 'wagmi';

export default function Header() {
  const balance = useGetTreasuryBalance();
  const { chain } = useNetwork();

  const value =
    chain && balance !== 0 && chain.unsupported === false
      ? `(${balance} ${chain?.nativeCurrency.symbol})`
      : null;
  return (
    <header className='z-50'>
      <div className='flex w-full items-center justify-between px-4 py-6'>
        <Link href='/'>
          <div className='text-[36.65px]  font-bold leading-[46.18px] '>
            FRAGMENTS
          </div>
        </Link>

        <div className=' flex items-center space-x-4'>
          {chain && chain.unsupported === false && (
            <Link href='/jobs' title='All Jobs' className='mr-2'>
              All Jobs
            </Link>
          )}
          {chain && chain.unsupported === false && (
            <Link
              href='/balance'
              title='All Jobs'
              className='mr-2 rounded-lg border border-[#464646] bg-[#262229] px-2 py-2'
            >
              Balance {value}
            </Link>
          )}

          {/* <ConnectButton showBalance /> */}
          <Web3Button />
        </div>
      </div>
    </header>
  );
}
