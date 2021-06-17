import React, { ReactElement, useEffect } from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { memo } from 'react';
import options, { AssetFamily, BatchAssignTarget, Priority } from 'src/declarations/enums/query';
import commonService from 'src/services/commonService';
import { toastMessage } from 'src/components/common/ToastMessage';
import { useState } from 'react';
import SearchSelect from 'src/components/SearchSelect';
const { Option } = Select;

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
    <Form form={form} size="small" onValuesChange={valueChange}>
      <div style={{ display: 'flex' }}>
        <Form.Item label="分配对象" name="assignType" rules={[{ required: true, message: '请选择/输入分配对象!' }]}>
          <Radio.Group value={formData.assignType}>
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
        <Radio.Group value={formData.priority}>
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
