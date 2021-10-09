import React, { memo, ReactElement } from 'react';
import { Form, Input } from 'antd';
import { useEffect } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

interface IUpdatePasswordModalProps {
  saveRef?: any;
}

const formItemLayout = {
  // 表单布局
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

const UpdatePasswordModal = ({ saveRef }: IUpdatePasswordModalProps): ReactElement => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (saveRef) {
      saveRef(form);
    }
  }, [form]);

  return (
    <Form form={form} {...formItemLayout}>
      <Form.Item
        name="password"
        label={<FormattedMessage id='New Password'/>}
        rules={[
          {
            required: true,
            message: '请输入新密码！'
          },
          {
            min: 6,
            message: '密码最少六位字符！'
          }
        ]}
        hasFeedback
      >
        <Input.Password visibilityToggle={false} />
      </Form.Item>
      <Form.Item
        name="confirm"
        label={<FormattedMessage id='Confirm New Password'/>}
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: '请输入新密码！'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致！'));
            }
          })
        ]}
      >
        <Input.Password visibilityToggle={false} />
      </Form.Item>
    </Form>
  );
};

export default memo(UpdatePasswordModal);
