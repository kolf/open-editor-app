import React, { ReactElement, useState } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SearchSelect from 'src/components/SearchSelect';
import InputSplit from 'src/components/InputSplit';
import 'src/styles/FormList.less';
import formData, { IFormItem, FormType } from './formData';

const { Option } = Select;
const { RangePicker } = DatePicker;

export type FormItemKeyType = typeof formData[number]['key'];

interface Props {
  formItemKeys: FormItemKeyType[];
  onChange: (values: any) => void;
  initialValues?: any;
}

function filterOption(input: string, option) {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

function getFormList(keys): IFormItem[] {
  console.log(formData, 'formData');
  return keys.map(key => formData.find(item => item.key === key));
}

export default React.memo(function FormList({ initialValues, onChange, formItemKeys }: Props): ReactElement {
  const [form] = Form.useForm(null);
  const [collapse, setCollapse] = useState(false);
  const formItems = getFormList(formItemKeys);
  const values = form.getFieldsValue();

  const renderFormItem = ({ formType, field, placeholder, options }: IFormItem): ReactElement => {
    switch (formType) {
      case 'TimeRange':
        return (
          <RangePicker
            inputReadOnly
            style={{ width: 190 }}
            separator={values[field] ? '~' : ''}
            placeholder={[placeholder, '']}
          />
        );
      case 'Select':
        return (
          <Select allowClear filterOption={filterOption} showSearch style={{ width: 100 }} placeholder={placeholder}>
            {options.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        );
      case 'SearchSelect':
        return (
          <SearchSelect type="provider" manual options={options} style={{ width: 160 }} placeholder={placeholder} />
        );
      case 'InputSplit':
        return <InputSplit placeholder={placeholder} />;
      default:
        return null;
    }
  };

  return (
    <div className="formList-root">
      <div className="formList-list" style={{ height: collapse ? 'auto' : 38 }}>
        <Form form={form} layout="inline" initialValues={initialValues} onValuesChange={onChange}>
          {formItems.map(item => (
            <Form.Item key={item.field} name={item.field} className="form-list-item">
              {renderFormItem(item)}
            </Form.Item>
          ))}
        </Form>
      </div>
      <div className="formList-dropdown">
        {collapse ? (
          <Button type="text" shape="circle" title="收缩" icon={<UpOutlined />} onClick={e => setCollapse(false)} />
        ) : (
          <Button type="text" shape="circle" title="展开" icon={<DownOutlined />} onClick={e => setCollapse(true)} />
        )}
      </div>
    </div>
  );
});
