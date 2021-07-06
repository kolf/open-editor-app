import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Input, message } from 'antd';
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { logout } from 'src/features/auth/authenticate';
import { setKeywords, openFire } from 'src/features/search/search';
import { PATH } from 'src/routes/path';
import { menus } from 'src/routes/menus';
import { RootState } from 'src/store';
import modal from 'src/utils/modal';
import UpdatePasswordModal from './UpdatePasswordModal';
import authService from 'src/services/authService';
const { Search } = Input;
export const Header: React.FC<any> = ({ menuKey, onChange }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const { show: showSearch } = useSelector(state => state.search);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    history.push(PATH.LOGIN);
  };

  const updatePassword = () => {
    let formRef = null;
    const mod = modal({
      width: 500,
      title: '修改密码',
      content: <UpdatePasswordModal saveRef={r => (formRef = r)} />,
      onOk,
      autoIndex: false
    });
    async function onOk() {
      const values = await formRef.validateFields();
      if (values.errorFields) return;

      try {
        const modifyPasswordResult = await authService.modifyPassword({
          ucId: user.ucId,
          newPassword: values.password
        });
        if (modifyPasswordResult.data.status !== '200') {
          throw modifyPasswordResult.data.msg;
        } else {
          mod && mod.close();
          handleLogout();
        }
      } catch (e) {
        mod && mod.close();
        message.error(e);
      }
    }
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <div onClick={updatePassword}>修改密码</div>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>退出</Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <h1 className="header-logo">内容审核管理平台</h1>
      <div className="header-menu">
        <Menu mode="horizontal" selectedKeys={[menuKey]} onClick={onChange}>
          {menus
            .filter(menu => !menu.hidden)
            .map(menu => (
              <Menu.Item key={menu.key}>
                <Link to={menu.path}>{menu.name}</Link>
              </Menu.Item>
            ))}
        </Menu>
      </div>
      {showSearch && (
        <div className="header-search">
          <Search
            allowClear
            placeholder="请输入关键词或ID，多个用逗号隔开"
            onChange={e => {
              dispatch(setKeywords(e.target.value));
            }}
            onSearch={e => {
              dispatch(openFire(true));
            }}
            enterButton="搜索"
            style={{ width: 320 }}
          />
        </div>
      )}
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
