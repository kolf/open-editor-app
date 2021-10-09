import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Button, Col, Form, Input, Row, Checkbox, message } from 'antd';
import { login } from 'src/features/auth/authenticate';
import { PATH } from 'src/routes/path';
import logoUrl from 'src/assets/img/logo.svg';
import './styles.less';
import { FormattedMessage } from 'react-intl';
import { useLanguage } from 'src/hooks/useLanguage';
import { setLanguage } from 'src/features/language/language';

Login.propTypes = {};

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [forgot, setForgot] = useState(true);
  const token = useSelector((state: any) => state.user.token);
  const loading = useSelector((state: any) => state.user.loading);
  const isChinese = useLanguage();

  useEffect(() => {
    if (token) history.push(PATH.USER_REVIEW_IMAGE_TEXT);
  }, [token]);

  const onFinish = async (values: any) => {
    if (forgot) {
      localStorage.setItem('userName', values.userName);
    }
    try {
      const res: any = await dispatch(login(values));
      if (res.error) {
        throw res.error;
      }
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
          <Form.Item name="userName" rules={[{ required: true, message: '请输入用户名！' }]}>
            <Input size="large" placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入用户密码!' }]}>
            <Input.Password size="large" placeholder="请输入用户密码" />
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
}

export default Login;
