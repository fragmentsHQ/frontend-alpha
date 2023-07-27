import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';

import Landing from '@/components/landing/Landing';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Time from '@/components/TriggerValues/Time';

export const TriggerValues = [
  {
    id: 1,
    name: 'Time',
    component: <Time />,
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
