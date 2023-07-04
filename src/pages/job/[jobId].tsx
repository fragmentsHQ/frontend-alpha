import { useRouter } from 'next/router';
import React from 'react';
import { useNetwork } from 'wagmi';
import { goerli, polygonMumbai } from 'wagmi/chains';

import GoerliTasks from '@/components/chains_tasks/GoerliTasks';
import PolygonTasks from '@/components/chains_tasks/PolygonTask';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const Job = () => {
  const router = useRouter();
  const { chain } = useNetwork();
  const jobId = router.query.jobId;

  if (!jobId) {
    return (
      <Layout>
        <Seo />
        <div className='text-center'>Loading...</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <Seo />
      {chain?.id === polygonMumbai.id && (
        <PolygonTasks jobId={jobId as string} />
      )}
      {chain?.id === goerli.id && <GoerliTasks jobId={jobId as string} />}
    </Layout>
  );
};

export default Job;
