import { Menu } from 'antd';
import React, { memo } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Iconfont from 'src/components/Iconfont';
import { menus } from '../../routes/menus';
import './styles.scss';

const { SubMenu } = Menu;

const getMenuActive = (path: string) => {
  const paths = path.split('/');
  return {
    menuActive: `/${paths[1]}` || '/',
    subMenuActive: paths[2]
  };
};

const MenuLink: React.FC<any> = ({ location, menuKey, siderbarKey }) => {
  const menuList = menus.find(menu => menu.key === menuKey)?.children || [];
  const menu = getMenuActive(location.pathname);

  return (
    <Menu
      className="dashboard-menu"
      mode="inline"
      selectedKeys={[location.pathname]}
      // defaultOpenKeys={[menu.menuActive]}
      defaultOpenKeys={[siderbarKey]}
    >
      {menuList.filter(sub => !sub.hidden).map((sub: any) => {
        if (sub.hasChild) {
          return (
            <SubMenu
              key={sub.key}
              className="dashboard-menu_sub"
              title={<span>{sub.name}</span>}
              icon={sub.icon ? <Iconfont type={sub.icon} /> : null}
            >
              {sub.children.map((item: any) => {
                if (!item.hidden)
                  return (
                    <Menu.Item key={item.key}>
                      <NavLink to={item.path || ''} className="dashboard-menu-link">
                        <span>{item.name}</span>
                      </NavLink>
                    </Menu.Item>
                  );
              })}
            </SubMenu>
          );
        }
        return (
          <Menu.Item
            className="dashboard-menu-item"
            key={sub.key}
            icon={sub.icon ? <Iconfont type={sub.icon} /> : null}
          >
            <NavLink to={sub.path || ''} className="dashboard-menu-link">
              <span>{sub.name}</span>
            </NavLink>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default withRouter(MenuLink);
