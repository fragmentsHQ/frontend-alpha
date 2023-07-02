import * as React from 'react';

import Header from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className='h-full w-full bg-[#262229] px-4 text-white    md:min-h-screen'>
      <div className=''>
        <Header />
        {children}
      </div>
    </div>
  );
}
