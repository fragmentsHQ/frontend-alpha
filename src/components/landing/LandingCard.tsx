import * as React from 'react';

import Card from '@/components/cards';
import Menu from '@/components/landing/LandingMenu';

const LandingCard: React.FC = () => {
  return (
    <React.Fragment>
      <Card className='w-[864px] bg-[#282828] p-[26px] text-black shadow-none'>
        <Menu />
      </Card>
    </React.Fragment>
  );
};

export default LandingCard;
