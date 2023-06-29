import { Tab } from '@headlessui/react';
import React from 'react';

type TabOption = {
  name: string;
  value: string;
};

type TabsMenuProps = {
  width?: string;
  options?: TabOption[];
  onChange?: (value: string) => void;
  listBg: string;
  tabBg: string;
  tabText: string;
  marTop?: string;
  isDifferentSubTabColor?: boolean;
  optionBgColor?: string;
};

const TabsMenu: React.FC<TabsMenuProps> = ({
  width = 'full',
  options = [],
  onChange,
  listBg,
  tabBg,
  tabText,
  marTop,
  isDifferentSubTabColor = false,
  optionBgColor = '',
}) => {
  const getWidthClassName = (width: string): string => {
    switch (width) {
      case 'full':
        return 'w-full';
      case '1/2':
        return 'w-1/2';
      default:
        return 'w-full';
    }
  };

  return (
    <Tab.Group>
      <Tab.List
        className={`flex ${getWidthClassName(width)} mt-${
          marTop ? marTop : '0'
        } space-x-3 rounded-[16px] bg-${listBg} p-2`}
      >
        {options.map((option) => (
          <Tab
            key={option.value}
            className={({ selected }) =>
              `${
                selected
                  ? `bg-${tabBg} text-[16px] font-medium text-${tabText}`
                  : `text-${tabText} ${
                      isDifferentSubTabColor ? `bg-${optionBgColor}` : ''
                    }`
              } flex w-full flex-1 items-center justify-center rounded-[12px] py-2 font-medium transition-all duration-200  focus:outline-none`
            }
            onClick={() => onChange && onChange(option.value)}
          >
            {option.name}
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
};

export default TabsMenu;
