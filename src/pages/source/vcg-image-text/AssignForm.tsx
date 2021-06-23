import React, { ReactElement, useEffect } from 'react';
import { Form, Radio } from 'antd';
import { memo } from 'react';
import options, { BatchAssignTarget, Priority } from 'src/declarations/enums/query';
import { useState } from 'react';
import SearchSelect from 'src/components/SearchSelect';

interface Props {
  saveRef?: any;
}

const AssignForm = ({ saveRef }: Props): ReactElement => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    assignType: BatchAssignTarget.全部资源,
    priority: Priority.正常
  });

  useEffect(() => {
    if (saveRef) {
      saveRef(form);
    }
  }, [form]);

  function valueChange(v) {
    setFormData(form.getFieldsValue());
  }

  return (
    <Form form={form} size="small" onValuesChange={valueChange} initialValues={{
      priority: formData.priority
    }}>
      <div style={{ display: 'flex' }}>
        <Form.Item label="分配对象" name="assignType" rules={[{ required: true, message: '请选择/输入分配对象!' }]}>
          <Radio.Group>
            {options.get(BatchAssignTarget).map((t, i) => (
              <Radio value={t.value} key={`${t.label}${i}`}>
                {t.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        {formData.assignType === BatchAssignTarget.编辑 && (
          <Form.Item name="userList" className="form-list-item" rules={[{ required: true, message: '请选择/输入分配对象!' }]}>
          <SearchSelect style={{ width: 160 }} placeholder="分配对象" type="editUser" mode='multiple' manual/>
        </Form.Item>
        )}
      </div>
      <Form.Item label="优先级" name="priority" rules={[{ required: true, message: '请选择优先级!' }]}>
        <Radio.Group>
          {options.get(Priority).map((t, i) => (
            <Radio value={t.value} key={`${t.label}${i}`}>
              {t.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default memo(AssignForm);
