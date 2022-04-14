import React, { memo, ReactElement } from 'react';
import { Form, Input } from 'antd';
import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
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

export default React.memo(function UpdatePasswordModal({ saveRef }: Props): ReactElement {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  useEffect(() => {
    if (saveRef) {
      saveRef(form);
    }
  }, [form]);

  return (
    <Form form={form} {...formItemLayout}>
      <Form.Item
        name="oldPassword"
        label={<FormattedMessage id="Old Password" />}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'input.placeholder' })
          },
          {
            min: 6,
            message: formatMessage({ id: 'form.password.error' })
          }
        ]}
        hasFeedback
      >
        <Input.Password visibilityToggle={false} />
      </Form.Item>
      <Form.Item
        name="password"
        label={<FormattedMessage id="New Password" />}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'input.placeholder' })
          },
          {
            min: 6,
            message: formatMessage({ id: 'form.password.error' })
          }
        ]}
        hasFeedback
      >
        <Input.Password visibilityToggle={false} />
      </Form.Item>
      <Form.Item
        name="confirm"
        label={<FormattedMessage id="Confirm New Password" />}
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'input.placeholder' })
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(formatMessage({ id: 'form.rePassword.error' })));
            }
          })
        ]}
      >
        <Input.Password visibilityToggle={false} />
      </Form.Item>
    </Form>
  );
});
