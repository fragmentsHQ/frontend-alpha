import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';

import Landing from '@/components/landing/Landing';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import GasPrices from '@/components/TriggerValues/GasPrices';
import Time from '@/components/TriggerValues/Time';
import TokenPairPrices from '@/components/TriggerValues/TokenPairPrices';

export const TriggerValues = [
  {
    id: 1,
    name: 'Time',
    component: <Time />,
  },
  {
    id: 2,
    name: 'Token Pair Price',
    component: <TokenPairPrices />,
  },
  {
    id: 3,
    name: 'Gas Price',
    component: <GasPrices />,
  },
];

const darkTheme = createTheme({
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  palette: {
    mode: 'dark',
  },
});

const Home = () => {
  // useAutoConnect();
  return (
    <ThemeProvider theme={darkTheme}>
      <Layout>
        <Seo />
        <Landing />
      </Layout>
    </ThemeProvider>
  );
};

export default Home;
