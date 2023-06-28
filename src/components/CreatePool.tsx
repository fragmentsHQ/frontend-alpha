import React, { useState } from 'react';
import useGlobalStore from 'store';
import { POOL__factory } from 'types/ethers-contracts';

import Button from '@/components/buttons/Button';
import Card from '@/components/cards';
import Input from '@/components/inputs/input';
import Row from '@/components/rows/Row';

const CreatePool = () => {
  const { signer } = useGlobalStore();
  const [tokenAddresses, setTokenAddresses] = useState({
    tokenAddress_A: '',
    tokenAddress_B: '',
    fee: '',
  });

  const createPool = async () => {
    if (
      tokenAddresses.tokenAddress_A.length !== 42 ||
      tokenAddresses.tokenAddress_B.length !== 42
    ) {
      return;
    }
    if (tokenAddresses.tokenAddress_A === tokenAddresses.tokenAddress_B) {
      return;
    }
    if (tokenAddresses.fee === '') {
      return;
    }
    if (!signer) {
      return;
    }
    const poolcontract = POOL__factory.connect(
      '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      signer
    );
    await poolcontract.createPool(
      tokenAddresses.tokenAddress_A,
      tokenAddresses.tokenAddress_B,
      tokenAddresses.fee
    );
  };
  return (
    <div>
      <p className='font-normal text-white text-opacity-40'>Select a token</p>
      <Row isBetween className='mt-2  w-full space-x-2'>
        <div className=' h-full w-full'>
          <Card className='w-full'>
            <Input
              value={tokenAddresses.tokenAddress_A}
              type='text'
              placeholder='Enter token address A'
              className='w-full'
              onChange={(e) => {
                setTokenAddresses({
                  ...tokenAddresses,
                  tokenAddress_A: e.target.value,
                });
              }}
            />
          </Card>
        </div>
      </Row>
      <Row isBetween className='mt-4  w-full space-x-2'>
        <div className=' h-full w-full'>
          <Card className='w-full'>
            <Input
              value={tokenAddresses.tokenAddress_B}
              type='text'
              placeholder='Enter token address B'
              className='w-full'
              onChange={(e) => {
                setTokenAddresses({
                  ...tokenAddresses,
                  tokenAddress_B: e.target.value,
                });
              }}
            />
          </Card>
        </div>
      </Row>
      <Row isBetween className='mt-4  w-full space-x-2'>
        <div className=' h-full w-full'>
          <Card className='w-full'>
            <Input
              value={tokenAddresses.fee}
              placeholder='Enter fee'
              className='w-full'
              onChange={(e) => {
                setTokenAddresses({
                  ...tokenAddresses,
                  fee: e.target.value,
                });
              }}
            />
          </Card>
        </div>
      </Row>
      <Button
        disabled={
          tokenAddresses.tokenAddress_A.length !== 42 ||
          tokenAddresses.tokenAddress_B.length !== 42 ||
          tokenAddresses.tokenAddress_A === tokenAddresses.tokenAddress_B ||
          tokenAddresses.fee === ''
        }
        onClick={createPool}
        className='mt-6  h-16  w-full rounded-2xl text-center'
      >
        Create a Pool
      </Button>
    </div>
  );
};

export default CreatePool;
