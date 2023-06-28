import React, { ComponentPropsWithRef } from 'react';

import clsxm from '@/lib/clsxm';

const Row: React.FC<
  ComponentPropsWithRef<'div'> & {
    isCentered?: boolean;
    isBetween?: boolean;
    isResponsive?: boolean;
    direction?: 'row' | 'col';
  }
> = ({
  ref,
  className,
  children,
  isBetween,
  isCentered,
  isResponsive,
  direction = 'row',
  ...rest
}) => {
  return (
    <div
      ref={ref}
      className={clsxm(
        'flex h-fit w-full  ',
        [
          isCentered && 'justify-center',
          direction === 'col' ? 'flex-col' : 'flex-row',
          isBetween && 'justify-between',
          isResponsive && 'flex-col md:flex-row',
        ],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Row;
