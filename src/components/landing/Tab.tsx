import React from 'react';

type TabOption = {
  name: string;
  value: string;
};

type TabsMenuProps = {
  width?: string;
  options?: TabOption[];
  onChange?: (value: string) => void;
  currentTab?: string | null;
};

const TabsMenu: React.FC<TabsMenuProps> = ({
  width = 'full',
  options = [],
  onChange,
  currentTab,
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
    <React.Fragment>
      <div
        className={`flex ${getWidthClassName(
          width
        )} space-x-3 rounded-[16px] bg-[#464646] p-2`}
      >
        {options.map((option) => (
          <a
            className={`${
              currentTab === option.value
                ? 'bg-[#0047CE] font-medium text-white'
                : 'bg-[#232323] text-white'
            } flex w-full flex-1  cursor-pointer items-center justify-center rounded-[12px] py-2  text-[16px] transition-all  duration-200 focus:outline-none`}
            key={option.value}
            onClick={() => onChange && onChange(option.value)}
          >
            {option.name}
          </a>
        ))}
      </div>
    </React.Fragment>
  );
};

export default TabsMenu;
