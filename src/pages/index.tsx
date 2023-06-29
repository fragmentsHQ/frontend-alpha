import React from 'react';

import Landing from '@/components/landing/Landing';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const Home = () => {
  return (
    <Layout>
      <Seo />
      <Landing />
    </Layout>
  );
};

export default Home;
