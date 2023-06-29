import { Menu } from '@headlessui/react';
import * as React from 'react';

import Row from '@/components/rows/Row';

const LandingMenu: React.FC = () => {
  return (
    <React.Fragment>
      <Row className='gap-10 ' direction='row'>
        <div>
          <Menu as='div'>
            <Menu.Button>Menu</Menu.Button>
            <Menu.Items>
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${active && 'bg-blue-500'}`}
                    href='/account-settings'
                  >
                    Account settings
                  </a>
                )}
              </Menu.Item>
              {/* <Menu.Item>Menu Item 2</Menu.Item>
              <Menu.Item>Menu Item 3</Menu.Item> */}
            </Menu.Items>
          </Menu>
        </div>
        <div>
          <Menu as='div'>
            <Menu.Button>Menu</Menu.Button>
            <Menu.Items>
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${active && 'bg-blue-500'}`}
                    href='/account-settings'
                  >
                    Account settings
                  </a>
                )}
              </Menu.Item>
              {/* <Menu.Item>Menu Item 2</Menu.Item>
              <Menu.Item>Menu Item 3</Menu.Item> */}
            </Menu.Items>
          </Menu>
        </div>
      </Row>
    </React.Fragment>
  );
};

export default LandingMenu;
