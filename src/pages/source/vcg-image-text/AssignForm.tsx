import React, { ReactElement, useEffect } from 'react';
import { Form, Input } from 'antd';

interface Props {
  saveRef?: any;
}

export default function AssignForm({ saveRef }: Props): ReactElement {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(saveRef, form, 'saveRef');
    if (saveRef) {
      saveRef(form);
    }
  }, [form]);

  return (
    <Form form={form} size="small">
      <Form.Item label="名字1" name="name1" rules={[{ required: true, message: '请输入名字!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="名字2" name="name2" rules={[{ required: true, message: '请输入名字!' }]}>
        <Input />
      </Form.Item>
    </Form>
  );
}
