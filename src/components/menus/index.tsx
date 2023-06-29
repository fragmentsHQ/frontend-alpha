import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React from 'react';

type MenuOption = {
  name: string;
  value: string;
};

type MenuProps = {
  currentValue?: string;
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
          <Menu.Button className='align-left flex w-full items-center justify-between rounded-[12px] bg-[#464646] px-[20px] py-[10px] text-[16px]  '>
            <span className='font-normal text-white'>{currentValue}</span>
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
                    <a
                      className={`${
                        active && 'bg-[#282828] '
                      } cursor-pointer px-4 py-2 text-white`}
                      onClick={() =>
                        onChangeState && onChangeState(option.value)
                      }
                    >
                      {option.name}
                    </a>
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
