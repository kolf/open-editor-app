import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { logOut } from 'src/features/auth/authenticate';
import { PATH } from 'src/routes/path';
import { menus } from 'src/routes/menus';
import { RootState } from 'src/store';

export const Header: React.FC<any> = ({ menuKey, onChange }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logOut());
    history.push(PATH.LOGIN);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to={PATH.PROFILE}>个人信息</Link>
      </Menu.Item>
      <Menu.Item danger onClick={handleLogout}>
        退出
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <h1 className="header-logo">VCG内容审核管理平台</h1>
      <div className="header-menu">
        <Menu mode="horizontal" selectedKeys={[menuKey]} onClick={onChange}>
          {menus.map((menu) => (
            <Menu.Item key={menu.key}>
              <Link to={menu.path}>{menu.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </div>
      <Dropdown overlay={menu} className="header-profile">
        <div>
          <Avatar icon={<UserOutlined />}></Avatar>
          <span className="userName">{user?.name}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default memo(Header);
