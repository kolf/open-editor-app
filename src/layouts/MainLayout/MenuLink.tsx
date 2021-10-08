import { Menu } from 'antd';
import React, { memo, useState, useEffect } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Iconfont from 'src/components/Iconfont';
import { menus } from '../../routes/menus';
import './styles.less';

const { SubMenu } = Menu;

const MenuLink: React.FC<any> = ({ location, menuKey, siderbarKey }) => {
  const menuList = menus.find(menu => menu.key === menuKey)?.children || [];
  const [openKey, setOpenKey] = useState([siderbarKey]);

  useEffect(() => {
    setOpenKey([siderbarKey]);
  }, [siderbarKey]);

  const handleClick = e => {
    setOpenKey(e);
  };

  return (
    <Menu
      className="dashboard-menu"
      mode="inline"
      selectedKeys={[location.pathname]}
      openKeys={openKey}
      onOpenChange={handleClick}
    >
      {menuList
        .filter(sub => !sub.hidden)
        .map((sub: any) => {
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
