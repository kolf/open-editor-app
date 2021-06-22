import React, { memo, ReactElement } from 'react';
import { Form, Input } from 'antd';
import { useEffect } from 'react';

interface IUpdatePasswordModalProps {
  saveRef?: any
}

const UpdatePasswordModal = ({ saveRef }: IUpdatePasswordModalProps): ReactElement => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (saveRef) {
      saveRef(form)
    }
  }, [form])

  return (
    <>
      <Form form={form} size='small'>
        <Form.Item
          name="password"
          label="新密码"
          rules={[{
              required: true,
              message: '请输入新密码！'
            },{
              min: 6,
              message: '密码最少六位字符！'
            }]}
          hasFeedback
        >
          <Input.Password visibilityToggle={false}/>
        </Form.Item>
        <Form.Item name="confirm" label="确认新密码" dependencies={['password']} rules={[{
          required: true,
          message: '请输入新密码！'
        }, ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入的密码不一致！'))
          }
        })]}>
          <Input.Password visibilityToggle={false}/>
        </Form.Item>
      </Form>
    </>
  );
};

export default memo(UpdatePasswordModal);
