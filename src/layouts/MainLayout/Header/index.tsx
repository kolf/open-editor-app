import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Input, message } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { logout } from 'src/features/auth/authenticate';
import { setKeywords, openFire } from 'src/features/search/search';
import { RootState } from 'src/store';
import modal from 'src/utils/modal';
import UpdatePasswordModal from './UpdatePasswordModal';
import authService from 'src/services/authService';
import { setLanguage } from 'src/features/language/language';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLanguagePkg } from 'src/hooks/useLanguage';
import { getFirstChild } from 'src/utils/tools';

const { Search } = Input;

const Header: React.FC<any> = ({ menuKey, onChange }) => {
  const { language } = useLanguagePkg();
  const { formatMessage } = useIntl();
  const user = useSelector((state: RootState) => state.user.user);
  const menus = useSelector((state: RootState) => state.user.menus);
  const { show: showSearch } = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

  const updatePassword = () => {
    let formRef = null;
    const mod = modal({
      width: 500,
      title: <FormattedMessage id="Modify Password" />,
      content: <UpdatePasswordModal saveRef={r => (formRef = r)} />,
      onOk,
      autoIndex: false
    });
    async function onOk() {
      const values = await formRef.validateFields();
      if (values.errorFields) return;

      try {
        const modifyPasswordResult = await authService.modifyPassword({
          oldPassword: values.oldPassword,
          newPassword: values.password
        });
        if (!modifyPasswordResult.data.success) {
          throw modifyPasswordResult.data.errMessage;
        }
        mod.close();
        handleLogout()
      } catch (e) {
        mod.close();
        message.error(e);
      }
    }
  };

  const getMenuPath = (menu) => {
    const firstChild = getFirstChild(menu.children || [])
    return firstChild ? firstChild.path : menu.path
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={() => dispatch(setLanguage())}>{language === 'en-US' ? '中文' : 'English'}</Menu.Item>
      <Menu.Item onClick={updatePassword}>
        <FormattedMessage id="Modify Password" />
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        <FormattedMessage id="Exit" />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <h1 className="header-logo">
        <FormattedMessage id="Inspection Platform" />
      </h1>
      <div className="header-menu">
        <Menu mode="horizontal" selectedKeys={[menuKey]} onClick={onChange}>
          {menus
            .filter(menu => menu.isEnabled)
            .map(menu => (
              <Menu.Item key={menu.id + ''}>
                <Link to={getMenuPath(menu)}>{menu.name}</Link>
              </Menu.Item>
            ))}
        </Menu>
      </div>
      {showSearch && (
        <div className="header-search">
          <Search
            allowClear
            placeholder={formatMessage({ id: 'Enter Keywords or ID, using "," to search multiples' })}
            onChange={e => {
              const value = e.target.value.replace(/，/g, ',');
              dispatch(setKeywords(value));
            }}
            onSearch={e => {
              dispatch(openFire(true));
            }}
            enterButton={formatMessage({ id: 'header.search.button' })}
            style={{ width: 390 }}
          />
        </div>
      )}
      <Dropdown overlay={menu} className="header-profile">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />}></Avatar>
          <span className="userName">{user?.truename}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default memo(Header);
