import React, { FC, memo } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
const { Option } = Select;

const options1 = [
  {
    value: '1',
    label: '选项1'
  },
  {
    value: '2',
    label: '选项2'
  }
];

export const FormList = (props: any) => {
  const handleChange = (e: any) => {
    props.onChange({ ...e, pageNum: 1 });
  };
  return (
    <Form layout="inline" onValuesChange={handleChange}>
      <Form.Item name="n1" className="filter-form-item">
        <DatePicker placeholder="入库时间" />
      </Form.Item>
      <Form.Item name="n2" className="filter-form-item">
        <DatePicker placeholder="审核时间" />
      </Form.Item>
      <Form.Item name="n3" className="filter-form-item">
        <Select style={{ width: 120 }}>
          {options1.map(o => (
            <Option key={o.value} value={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="n4" className="filter-form-item">
        <Input placeholder="数据来源" />
      </Form.Item>
      <Form.Item name="n5" className="filter-form-item">
        <Input placeholder="AI质量评分" />
      </Form.Item>
      <Form.Item name="n6" className="filter-form-item">
        <Input placeholder="AI美学评分" />
      </Form.Item>
      <Form.Item name="n7" className="filter-form-item">
        <Input placeholder="质量等级" />
      </Form.Item>
    </Form>
  );
};

export default memo(FormList);
