import { Menu } from 'antd';
import React, { memo, useState, useEffect } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import Iconfont from 'src/components/Iconfont';
import './styles.less';

const { SubMenu } = Menu;

const getCurrentMenu = (data, path) => {
  let result = data.find(item => item.path === path);
  if (!result) {
    data.forEach(item => {
      const r = getCurrentMenu(item.children, path);
      if (r) result = r;
    })
  }
  return result
}

const getOpenKey = (data, path) => {
  const currentMenu = getCurrentMenu(data, path);
  if (currentMenu && data.find(item => item.id === currentMenu.pid)) {
    return currentMenu.pid + ''
  }
  return ''
}

const MenuLink: React.FC<any> = ({ location, menu }) => {
  const [openKey, setOpenKey] = useState([getOpenKey(menu, location.pathname)]);
  const selectedKey = React.useMemo(() => {
    const currentMenu = getCurrentMenu(menu, location.pathname);
    return currentMenu.id + ''
  }, [location.pathname])

  useEffect(() => {
    setOpenKey([getOpenKey(menu, location.pathname)]);
  }, [location.pathname]);

  const handleClick = e => {
    setOpenKey(e);
  };

  return (
    <Menu
      className="dashboard-menu"
      mode="inline"
      selectedKeys={[selectedKey]}
      openKeys={openKey}
      onOpenChange={handleClick}
    >
      {menu
        .filter(menuItem => menuItem.isEnabled)
        .map((menuItem: any) => {
          if (menuItem.children && menuItem.children.length > 0) {
            return (
              <SubMenu
                key={menuItem.id + ''}
                className="dashboard-menu_sub"
                title={<span>{menuItem.name}</span>}
                icon={menuItem.icon ? <Iconfont type={menuItem.icon} /> : null}
              >
                {menuItem.children.map((item: any) => {
                  if (item.isEnabled)
                    return (
                      <Menu.Item key={item.id + ''}>
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
              key={menuItem.id + ''}
              icon={menuItem.icon ? <Iconfont type={menuItem.icon} /> : null}
            >
              <NavLink to={menuItem.path || ''} className="dashboard-menu-link">
                <span>{menuItem.name}</span>
              </NavLink>
            </Menu.Item>
          );
        })}
    </Menu>
  );
};

export default withRouter(MenuLink);
