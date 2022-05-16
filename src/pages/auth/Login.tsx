import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, Input, Row, Checkbox, message } from 'antd';
import { login, logout } from 'src/features/auth/authenticate';
import './styles.less';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLanguage } from 'src/hooks/useLanguage';
import { setLanguage } from 'src/features/language/language';
import { getFirstChild } from 'src/utils/tools';

export default React.memo(function Login() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [forgot, setForgot] = useState(true);
  const loading = useSelector((state: any) => state.user.loading);
  const isChinese = useLanguage();

  useEffect(() => {
    dispatch(logout())
  }, []);

  const onFinish = async (values: any) => {
    if (forgot) {
      localStorage.setItem('userName', values.userName);
    }
    try {
      const res: any = await dispatch(login(values));
      if (res.error) {
        throw res.error;
      }

      const firstMenuItem = getFirstChild(res.payload.menus)
      if (!firstMenuItem) {
        throw new Error(`对不起，您没有任何菜单访问权限！`)
      }

      window.location.href = firstMenuItem.path
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      className="login"
      style={{
        backgroundImage: `url(https://bing.ioliu.cn/v1/rand?w=1920&h=1080)`
      }}
    >
      <div className="login-form">
        <div className="login-brand">
          <h1>
            <FormattedMessage id="Inspection Platform" />
          </h1>
        </div>
        <Form initialValues={{ userName: localStorage.getItem('userName') }} onFinish={onFinish}>
          <Form.Item name="userName" rules={[{ required: true, message: formatMessage({ id: 'input.placeholder' }) }]}>
            <Input size="large" placeholder={formatMessage({ id: 'input.placeholder' })} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: formatMessage({ id: 'input.placeholder' }) }]}>
            <Input.Password size="large" placeholder={formatMessage({ id: 'input.placeholder' })} />
          </Form.Item>
          <Form.Item>
            <Button size="large" type="primary" htmlType="submit" loading={loading} block>
              <FormattedMessage id="Login" />
            </Button>
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <Checkbox
                  onChange={e => {
                    setForgot(e.target.checked);
                  }}
                >
                  <FormattedMessage id="Remember Username" />
                </Checkbox>
              </div>
              <div style={{ cursor: 'pointer' }} onClick={() => dispatch(setLanguage())}>
                {isChinese ? 'English' : '中文'}
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Row>
  );
});
