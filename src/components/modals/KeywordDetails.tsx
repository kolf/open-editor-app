import React, { ReactElement } from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { useIntl } from 'react-intl';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

interface Props {
  dataSource: any;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
};

const kinds: IKeywordsTag['kind'][] = [0, 1, 2, 3, 4];

export default function KeywordDetails({ dataSource }: Props): ReactElement {
  const { formatMessage } = useIntl();

  const makeInitialValues = dataSource => {
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
  };

  const kindOptions = kinds.map(kind => ({
    value: kind,
    label: formatMessage({ id: `keywords.kind.${kind}` })
  }));

  return (
    <Form initialValues={makeInitialValues(dataSource)} className="form-readonly">
      <FormItem label={formatMessage({ id: 'keywords.details.cnname' })} {...formItemLayout} name="cnname">
        <Input disabled />
      </FormItem>
      <FormItem label={formatMessage({ id: 'keywords.details.cnsyno' })} {...formItemLayout} name="cnsyno">
        <Select disabled mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
      </FormItem>
      <FormItem label={formatMessage({ id: 'keywords.details.enname' })} {...formItemLayout} name="enname">
        <Input disabled />
      </FormItem>
      <FormItem label={formatMessage({ id: 'keywords.details.ensyno' })} {...formItemLayout} name="ensyno">
        <Select disabled mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />
      </FormItem>
      <FormItem label={formatMessage({ id: 'keywords.details.kind' })} {...formItemLayout} name="kind">
        <RadioGroup disabled>
          {kindOptions.map(item => (
            <Radio value={item.value + ''} key={item.value}>
              {item.label}
            </Radio>
          ))}
        </RadioGroup>
      </FormItem>

      <FormItem label={formatMessage({ id: 'keywords.details.pid' })} {...formItemLayout} name="pid">
        <Input disabled />
      </FormItem>

      <FormItem label={formatMessage({ id: 'keywords.details.memo' })} {...formItemLayout} name="memo">
        <Input disabled type="textarea" />
      </FormItem>
    </Form>
  );
}
