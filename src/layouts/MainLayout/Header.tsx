import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { logOut } from 'src/features/auth/authenticate';
import { PATH } from 'src/routes/path';
import { RootState } from 'src/store';

function Header() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const handlelogout = () => {
    dispatch(logOut());
    history.push(PATH.LOGIN);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to={PATH.PROFILE}>个人信息</Link>
      </Menu.Item>
      <Menu.Item danger onClick={handlelogout}>
        退出
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <div></div>
      <Dropdown overlay={menu} className="header-profile">
        <div>
          <Avatar icon={<UserOutlined />}></Avatar>
          <span className="userName">{user?.name}</span>
        </div>
      </Dropdown>
    </div>
  );
}

export default memo(Header);
