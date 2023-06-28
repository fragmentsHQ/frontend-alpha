import clsx from 'clsx';
import React from 'react';

import clsxm from '@/lib/clsxm';
import useGetTokenBalances from '@/hooks/useGetTokenBalances';

import Row from '@/components/rows/Row';
type tokenRowProps = {
  imageurl: string;
  tokenName: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
} & React.ComponentPropsWithRef<'div'>;
import Image from 'next/image';

import Card from '@/components/cards';

import { Token } from '@/config/tokens';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & {
    token?: Token;
  }
>(({ token, disabled, value, className, placeholder, ...inputprops }, ref) => {
  return (
    <Row
      isBetween
      className={clsx(
        ' w-full rounded-2xl    px-3 py-3',
        disabled && 'cursor-not-allowed'
      )}
    >
      <div className='w-full'>
        <input
          ref={ref}
          value={value === 0 ? '' : value}
          disabled={disabled}
          type='number'
          className={clsxm(
            'h-10 w-full rounded-xl border border-none border-white bg-transparent px-2 py-2 text-3xl placeholder:text-white placeholder:text-opacity-10  focus:outline-none focus:ring-0 disabled:cursor-not-allowed',
            className
          )}
          placeholder={placeholder || '0'}
          {...inputprops}
        />
        {token && (
          <p className='ml-2 mt-2 text-sm text-white text-opacity-40'>-</p>
        )}
      </div>
      {token && <TokenDetails token={token} />}
    </Row>
  );
});

export default Input;

const TokenDetails = ({ token }: { token: Token }) => {
  const { data } = useGetTokenBalances({
    tokenContractAddress: token.address,
  });
  return (
    <div className='w-fit'>
      <TokenRow
        size='sm'
        tokenName={token.symbol}
        className='border border-white border-opacity-10 bg-white bg-opacity-5  '
        imageurl={token.image}
      />
      <p className='mt-2 text-sm text-white text-opacity-40'>
        Balance - {data?.toString()}
      </p>
    </div>
  );
};

export const TokenRow = React.forwardRef<HTMLDivElement, tokenRowProps>(
  ({ imageurl, tokenName, size = 'md', disabled, className }, ref) => {
    return (
      <Card
        ref={ref}
        className={clsxm(
          [disabled && 'cursor-not-allowed'],
          [size === 'sm' && 'px-2 py-2 text-lg'],
          [size === 'md' && 'px-3 py-3 text-xl'],
          className
        )}
      >
        <Row>
          <div
            className={clsxm(
              'relative mr-2',
              [size === 'sm' && 'h-6 w-6'],
              [size === 'md' && 'h-8 w-8']
            )}
          >
            <Image src={imageurl} fill alt={tokenName} />
          </div>

          {tokenName.toUpperCase()}
        </Row>
      </Card>
    );
  }
);
