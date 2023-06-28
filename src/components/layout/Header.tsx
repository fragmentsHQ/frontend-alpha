import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as React from 'react';

export default function Header() {
  return (
    <header className='z-50'>
      <div className=' flex h-[15vh] items-center justify-end'>
        {/* <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          <div className='relative h-[38px] w-[30px] cursor-pointer md:h-[48px] md:w-[40px]'>
            <Image
              src={require('../../../public/images/valent-white.png')}
              alt='valent'
              fill
            />
          </div>
        </UnstyledLink> */}
        <ConnectButton />
      </div>
    </header>
  );
}
