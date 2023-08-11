import Image from 'next/image';
import * as React from 'react';

import Header from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=' h-full w-full  bg-[#131822] px-4 text-white    md:min-h-screen'>
      <div className='mx-auto max-w-7xl'>
        <Header />
        <div className='flex h-full min-h-screen w-full items-start justify-between px-4'>
          <div className='relative mt-[200px] h-[200px] w-[20px]'>
            <Image
              src={require('../../../public/graphic.png')}
              fill
              alt='Left'
            />
          </div>
          <div className='relative min-h-screen w-full'>
            {children}
            <div className='flex w-full items-center justify-center'>
              <div
                className='relative ml-[100px] mt-[100px]  h-[200px] w-[400px]       
            '
              >
                <Image
                  src={require('../../../public/flakes.png')}
                  fill
                  alt='flakes'
                />
              </div>
            </div>
          </div>
          <div className='relative mt-[200px] h-[200px] w-[20px]'>
            <Image
              src={require('../../../public/graphic.png')}
              fill
              alt='Left'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
