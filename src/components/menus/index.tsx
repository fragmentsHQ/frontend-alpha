import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import React from 'react';

import { getLogo } from '@/components/landing/LandingMenu';

type MenuOption = {
  name: string;
  value: string;
  icon: string;
};

type MenuProps = {
  currentValue?: string | null | undefined;
  items?: MenuOption[];
  onChangeState?: (value: string) => void;
};

const CustomMenu: React.FC<MenuProps> = ({
  currentValue,
  items,
  onChangeState,
}) => {
  return (
    <Menu as='div' className='-w-full relative'>
      {({ open }) => (
        <>
          <Menu.Button className='align-left flex w-full items-center justify-between rounded-[12px] bg-[#464646] px-[20px] py-[10px] text-[16px]'>
            <div className='font-normal text-white'>
              {currentValue === null ? (
                'Selection'
              ) : (
                <div className='flex items-center space-x-2'>
                  <div className={`relative h-[20px] w-[20px] `}>
                    <Image
                      src={getLogo(currentValue)}
                      fill
                      alt={getLogo(currentValue)}
                      // className={`${active && 'bg-[#282828]'}`}
                    />
                  </div>
                  <div>{currentValue}</div>
                </div>
              )}
            </div>
            <ChevronDownIcon
              className='-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100'
              aria-hidden='true'
            />
          </Menu.Button>
          <Transition
            show={open}
            enter='transition ease-out duration-100'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 flex w-full origin-top-right flex-col rounded-md bg-[#464646] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              {items?.map((option: MenuOption, index: number) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    // <div className='group flex items-center space-x-2'>
                    <a
                      className={`${
                        active && 'bg-[#282828]'
                      } flex w-full cursor-pointer items-center space-x-2 px-4 py-2 text-white`}
                      onClick={() =>
                        onChangeState && onChangeState(option.value)
                      }
                    >
                      {option.icon && (
                        <div className={`relative h-[20px]  w-[20px] `}>
                          <Image
                            src={option.icon}
                            alt={option.name}
                            fill
                            // className={`${active && 'bg-[#282828]'}`}
                          />
                        </div>
                      )}
                      <div>{option.name}</div>
                    </a>
                    // </div>
                  )}
                </Menu.Item>
              ))}

              {/* <Menu.Item>Menu Item 2</Menu.Item>
              <Menu.Item>Menu Item 3</Menu.Item> */}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default CustomMenu;
