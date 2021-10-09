import React, { ReactElement, useEffect } from 'react';
import { Form, Radio } from 'antd';
import { memo } from 'react';
import options, { BatchAssignTarget, Priority } from 'src/declarations/enums/query';
import { useState } from 'react';
import SearchSelect from 'src/components/SearchSelect';
import { FormattedMessage } from 'react-intl';
import zhCN from 'src/locales/zhCN';

interface Props {
  saveRef?: any;
}

const AssignForm = ({ saveRef }: Props): ReactElement => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    assignType: BatchAssignTarget.编辑,
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
      priority: formData.priority,
      assignType: formData.assignType
    }}>
      <div style={{ display: 'flex' }}>
        <Form.Item label={<FormattedMessage id='Editors'/>} name="assignType" rules={[{ required: true, message: '请选择/输入分配对象!' }]}>
          <Radio.Group>
            {options.get(BatchAssignTarget).map((t, i) => (
              <Radio value={t.value} key={`${t.label}${i}`} disabled={t.value === BatchAssignTarget.全部资源}>
                <FormattedMessage id={options.map(zhCN)[t.label]}/>
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        {formData.assignType === BatchAssignTarget.编辑 && (
          <Form.Item name="userList" className="form-list-item" rules={[{ required: true, message: '请选择/输入分配对象!' }]}>
          <SearchSelect style={{ width: 160 }} placeholder={<FormattedMessage id='Editors'/>} type="editUser" mode='multiple' manual/>
        </Form.Item>
        )}
      </div>
      <Form.Item label={<FormattedMessage id='Priority'/>} name="priority" rules={[{ required: true, message: '请选择优先级!' }]}>
        <Radio.Group>
          {options.get(Priority).map((t, i) => (
            <Radio value={t.value} key={`${t.label}${i}`}>
              <FormattedMessage id={options.map(zhCN)[t.label]}/>
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default memo(AssignForm);
