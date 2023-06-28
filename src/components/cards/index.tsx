import React, { ComponentPropsWithoutRef } from 'react';

import clsxm from '@/lib/clsxm';

const Card = React.forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsxm('shadow-bid rounded-lg bg-[#0B0B0B]', className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default Card;
