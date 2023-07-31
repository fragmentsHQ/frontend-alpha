import { Tab } from '@headlessui/react';
import { useState } from 'react';
import { useNetwork } from 'wagmi';
import { goerli, polygonMumbai } from 'wagmi/chains';

import GoerliJobsTable from '@/components/chains_tasks/JobsTable';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function JobsTab() {
  const { chain } = useNetwork();
  const [categories] = useState({
    All: {},
    Ongoing: {},
    Completed: {},
  });

  return (
    <div className='w-full  px-2  sm:px-0'>
      <Tab.Group>
        <Tab.List className='flex max-w-md space-x-2 rounded-xl bg-[#373A40] p-2'>
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white',
                  'focus:outline-none focus:ring-0',
                  selected
                    ? 'bg-[#1867FD]  shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='mt-4'>
          {Object.keys(categories).map((key, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'w-full rounded-xl  bg-[#272E3C] px-6 py-6'
              )}
            >
              {chain?.id === polygonMumbai.id && (
                <GoerliJobsTable client='endpoint2' filter={key} />
              )}
              {chain?.id === goerli.id && (
                <GoerliJobsTable client='endpoint1' filter={key} />
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
