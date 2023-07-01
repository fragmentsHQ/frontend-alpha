import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react'

import DatePicker from '@/components/DatePicker';
import Row from '@/components/rows/Row';




export interface TimeIntervalConfigRowValues {
  startTime?: Dayjs 
  endTime?: Dayjs,
  frequency?: integer
}


interface ITimeIntervalConfigRow {
  autoPayMode: string,
  onChange: (v: TimeIntervalConfigRowValues) => void
  defaultValue: TimeIntervalConfigRowValues | null,
}

const TimeIntervalConfigRow: React.FC<ITimeIntervalConfigRow> = (props) => {

  const [currentValue, setCurrentValue] = useState<TimeIntervalConfigRowValues>({
    startTime: props.defaultValue?.startTime,
    endTime: props.defaultValue?.endTime,
    frequency: props.defaultValue?.frequency
  })

  useEffect(() => {
    props.onChange(currentValue)
  }, [currentValue])

  return (
    <>
    <Row className='gap-[30px]   bg-[#282828] p-[20px] shadow-none' direction='row'>

        <div className='relative w-full'>
          <div className='mb-1 text-[18px] font-medium text-white'>
            Start Date
          </div>
        <DatePicker onChange={(v) => setCurrentValue({
          ...currentValue,
          startTime: v
        })}/>
        </div>

        <div className='relative w-full'>
          <div className='mb-1 text-[18px] font-medium text-white'>
            End Date
          </div>
        <DatePicker onChange={(v) => setCurrentValue({
          ...currentValue,
          endTime: v
        })}/>
        </div>

        <div className='relative w-full'>

          <Menu as='div' className='flex flex-col justify-between h-full'>
            <div className='mb-1 text-[18px] font-medium text-white'>
              Frequency
            </div>
            <Menu.Button className='align-left flex w-full items-center justify-between rounded-[10px] bg-[#262229] px-2 py-4 text-[18px]  '>
              <span className='font-normal text-white'>
                {currentValue.frequency}
              </span>
              <ChevronDownIcon
                className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
                aria-hidden='true'
              />
            </Menu.Button>
            <Menu.Items className='absolute right-0 mt-2 flex w-full origin-top-right flex-col rounded-md bg-[#262229] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                {Array.apply(0, Array(5)).map(function (_value, i) {
                  return (
                    <Menu.Item key={i+1}>
                      {({ active }) => (
                        <a
                          className={`${
                            active && 'bg-[#282828] '
                          } cursor-pointer px-4 py-2 text-white`}
                          onClick={(value) => {
                            setCurrentValue({
                              ...currentValue,
                              frequency: i+1
                            })
                          }}
                        >
                          {i+1}
                        </a>
                      )}
                    </Menu.Item>
                  )
                })}
            </Menu.Items>
          </Menu>
        </div>
      </Row>
    </>
  )
}

export default TimeIntervalConfigRow