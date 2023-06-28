import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as React from 'react';

export default function Header() {
  return (
    <header className='z-50'>
      <div className=' flex h-[15vh] items-center justify-end'>
        <ConnectButton />
      </div>
    </header>
  );
}
