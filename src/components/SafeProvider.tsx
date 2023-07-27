import useAutoConnect from '@/hooks/useAutoConnect';
import { ComponentProps } from 'react';

const SafeProviderWrapper: React.FC<ComponentProps<'div'>> = ({ children }) => {
  useAutoConnect();

  return <></>;
};

export default SafeProviderWrapper;
