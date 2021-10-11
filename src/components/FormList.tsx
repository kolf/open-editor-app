import React, { ReactElement, useState } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SearchSelect from 'src/components/SearchSelect';
import InputSplit from 'src/components/InputSplit';
import useFormItems, { IFormItem, IFormItemKey } from 'src/hooks/useFormItems';

import 'src/styles/FormList.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Props {
  itemKeys: IFormItemKey[];
  onChange: (values: any) => void;
  initialValues?: any;
}

function filterOption(input: string, option) {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export default React.memo(function FormList({ initialValues, onChange, itemKeys = [] }: Props): ReactElement {
  const [form] = Form.useForm(null);
  const formItems = useFormItems(itemKeys);
  const [collapse, setCollapse] = useState(false);
  const values = form.getFieldsValue();

  const renderFormItem = ({ restProps, formType, field, placeholder, options = [] }: IFormItem): ReactElement => {
    // console.log(options, 'options');
    switch (formType) {
      case 'TimeRange':
        return (
          <RangePicker
            inputReadOnly
            style={{ width: restProps?.width || 190 }}
            separator={values[field] ? '~' : ''}
            placeholder={[placeholder, '']}
          />
        );
      case 'Select':
        return (
          <Select allowClear filterOption={filterOption} showSearch style={{ width: 110 }} placeholder={placeholder}>
            {options.map(o => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        );
      case 'SearchSelect':
        return (
          <SearchSelect
            type={restProps.type}
            manual
            options={options}
            style={{ width: 160 }}
            placeholder={placeholder}
          />
        );
      case 'InputSplit':
        return <InputSplit placeholder={placeholder} />;
      default:
        return null;
    }
  };

  return (
    <div className="formList-root">
      <div className="formList-list" style={{ height: collapse ? 'auto' : 40 }}>
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
