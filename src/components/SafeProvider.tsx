import { ComponentProps } from 'react';

import useAutoConnect from '@/hooks/useAutoConnect';

const SafeProviderWrapper: React.FC<ComponentProps<'div'>> = ({ children }) => {
  useAutoConnect();

  return <></>;
};

export default SafeProviderWrapper;
