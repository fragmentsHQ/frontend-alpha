import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import * as React from 'react';
import { Chain, useNetwork } from 'wagmi';

import { CHAIN_IMAGES, Token, TOKENS } from '@/config/tokens';
import { chains } from '@/config/contracts';

export default function ChainMenu({
  initialChain,
  onChainChange,
}: {
  initialChain: number;
  onChainChange: (chain: Chain) => void;
}) {
  const [selectedChain, setSelectedChain] = React.useState<Chain | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (initialChain !== 0) {
      onChainChange(chains.filter((ch) => ch.id === initialChain)[0]);
      setSelectedChain(chains.filter((c) => c.id === initialChain)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialChain]);

  return (
    <div>
      <Button
        id='chains-positioned-button'
        aria-controls={open ? 'chains-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{
          color: '#fff',
        }}
      >
        {selectedChain ? (
          <div className='flex items-center justify-start'>
            <div className='relative mr-2 h-[1.5rem] w-[1.5rem] overflow-hidden rounded-full py-2'>
              <Image
                src={CHAIN_IMAGES[selectedChain.id].image_url}
                fill
                alt='Logo'
              />
            </div>
            {selectedChain.name}
          </div>
        ) : (
          <div className='text-white text-opacity-20'>Select a chain</div>
        )}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='ml-2 h-4 w-4'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M19.5 8.25l-7.5 7.5-7.5-7.5'
          />
        </svg>
      </Button>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setSelectedChain(selectedChain);
          handleClose();
        }}
        style={{
          width: '400px',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {chains.map((chain, index) => (
          <MenuItem
            onClick={() => {
              setSelectedChain(chain);
              onChainChange(chain);
              handleClose();
            }}
            key={index}
          >
            <div className='relative mr-2 h-[1.5rem] w-[1.5rem] overflow-hidden rounded-full py-2'>
              <Image src={CHAIN_IMAGES[chain.id].image_url} fill alt='Logo' />
            </div>
            {chain.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export function TokenMenu({
  initialToken,
  selectedChain,
  onTokenChange,
}: {
  selectedChain: number;
  initialToken: string;
  onTokenChange: (token: Token | null) => void;
}) {
  const [selectedToken, setSelectedToken] = React.useState<Token | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    if (initialToken && selectedChain) {
      try {
        const token = TOKENS[selectedChain].filter(
          (d) => d.address === initialToken
        )[0];
        onTokenChange(token);
        setSelectedToken(token);
      } catch (error) {
        onTokenChange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToken, selectedChain]);

  return (
    <div>
      <Button
        id='chains-positioned-button'
        aria-controls={open ? 'chains-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled={!selectedChain}
        style={{
          color: '#fff',
        }}
      >
        {selectedToken ? (
          <div className='flex items-center justify-start'>
            <div className='relative mr-2  h-[1.5rem] w-[1.5rem] overflow-hidden rounded-full py-2'>
              <Image src={selectedToken.image} fill alt='Logo' />
            </div>
            {selectedToken.name}
          </div>
        ) : (
          <div className='text-white text-opacity-20'>
            {selectedChain ? 'Select a token' : 'Select chain to proceed'}
          </div>
        )}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='ml-2 h-4 w-4'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M19.5 8.25l-7.5 7.5-7.5-7.5'
          />
        </svg>
      </Button>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {selectedChain &&
          TOKENS[selectedChain].map((token, index) => (
            <MenuItem
              onClick={() => {
                onTokenChange(token);
                handleClose();
              }}
              key={index}
            >
              <div className='relative mr-2 h-[1.5rem] w-[1.5rem] overflow-hidden rounded-full py-2'>
                <Image src={token.image} fill alt='Logo' />
              </div>
              {token.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
