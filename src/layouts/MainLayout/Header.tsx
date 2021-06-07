import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { logOut } from 'src/features/auth/authenticate';
import { PATH } from 'src/routes/path';
import { RootState } from 'src/store';

export const Header: React.FC<any> = ({ onChange }) => {
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
      <div className="header-menu" style={{ flex: 1 }}>
        <Menu mode="horizontal" onClick={onChange}>
          <Menu.Item>
            <Link to={PATH.PROFILE}>数据分配</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={PATH.PROFILE}>全部资源</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={PATH.PROFILE}>我的审核</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={PATH.PROFILE}>终审</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={PATH.PROFILE}>数据统计</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={PATH.PROFILE}>帮助</Link>
          </Menu.Item>
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
