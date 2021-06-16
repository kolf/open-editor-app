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
  return (
    <Form layout="inline" onValuesChange={props.onChange}>
      <Form.Item name="createdTime" className="form-list-item">
        <DatePicker placeholder="入库时间" />
      </Form.Item>
      <Form.Item name="qualityEditTime" className="form-list-item">
        <DatePicker placeholder="审核时间" />
      </Form.Item>
      <Form.Item name="n4" className="form-list-item">
        <Select allowClear style={{ width: 120 }} placeholder="审核状态">
          {options1.map(o => (
            <Option key={o.value} value={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="n5" className="form-list-item">
        <Select allowClear style={{ width: 120 }} placeholder="数据来源">
          {options1.map(o => (
            <Option key={o.value} value={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="n6" className="form-list-item">
        <Select allowClear style={{ width: 120 }} placeholder="AI质量评分">
          {options1.map(o => (
            <Option key={o.value} value={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="n7" className="form-list-item">
        <Select allowClear style={{ width: 120 }} placeholder="AI美学评分">
          {options1.map(o => (
            <Option key={o.value} value={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="n8" className="form-list-item">
        <Select allowClear style={{ width: 120 }} placeholder="质量等级">
          {options1.map(o => (
            <Option key={o.value} value={o.value}>
              {o.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default memo(FormList);
