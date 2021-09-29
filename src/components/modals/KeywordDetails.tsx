import React, { ReactElement } from 'react';
import { Form, Input, Radio, Select } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

interface Props {
  dataSource: any;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

const defaultKinds = [
  {
    label: '主题',
    value: '0'
  },
  {
    label: '概念',
    value: '1'
  },
  {
    label: '规格',
    value: '2'
  },
  {
    label: '人物',
    value: '3'
  },
  {
    label: '地点',
    value: '4'
  }
];

export default function KeywordDetails({ dataSource }: Props): ReactElement {
  function makeInitialValues(dataSource) {
    return Object.keys(dataSource).reduce((result, field) => {
      const value = dataSource[field];
      let nextValue = value;
      if (/^(cnsyno|ensyno)$/.test(field) && value) {
        nextValue = [...new Set(value)];
      } else if (field === 'kind') {
        nextValue = value || value === 0 ? value + '' : undefined;
      }

      result[field] = nextValue;

      return result;
    }, {});
  }

  return (
    <Form initialValues={makeInitialValues(dataSource)} className="form-readonly">
      <FormItem label="中文名" {...formItemLayout} name="cnname">
        <Input disabled />
      </FormItem>
      <FormItem label="中文同义词" {...formItemLayout} name="cnsyno">
        <Select disabled mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
      </FormItem>
      <FormItem label="英文名" {...formItemLayout} name="enname">
        <Input disabled placeholder="请输入英文名" />
      </FormItem>
      <FormItem label="英文同义词" {...formItemLayout} name="ensyno">
        <Select disabled mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
      </FormItem>
      <FormItem label="类型" {...formItemLayout} name="kind">
        <RadioGroup disabled>
          {defaultKinds.map(item => (
            <Radio value={item.value} key={item.value}>
              {item.label}
            </Radio>
          ))}
        </RadioGroup>
      </FormItem>

      <FormItem label="父ID" {...formItemLayout} name="pid">
        <Input disabled placeholder="请输入父ID" />
      </FormItem>

      <FormItem label="备注" {...formItemLayout} name="memo">
        <Input disabled type="textarea" placeholder="请输入备注" />
      </FormItem>
    </Form>
  );
}
