import React from 'react';

import LandingCard from '@/components/landing/LandingCard';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const Home = () => {
  return (
    <Layout>
      <Seo />
      <LandingCard />
    </Layout>
  );
};

export default Home;
