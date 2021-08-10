import React, { useState, useEffect } from 'react';
import { Collapse, Checkbox, Input, message } from 'antd';
const { Panel } = Collapse;

interface Props {
  dataSource: any;
  onChange?: any;
}

const SelectReject = ({ dataSource, onChange }: Props) => {
  const [value, setValue] = useState([]);
  const [otherValue, setOtherValue] = useState('');

  const handleChange = e => {
    const { checked, value: newValue } = e.target;
    setOtherValue('');
    let nextValue = [];
    if (checked) {
      if (value.length >= 3) {
        message.info(`最多选择三个不通过原因，请取消一个再选择~！`);
        return;
      }
      nextValue = [...value, newValue];
    } else {
      nextValue = value.filter(v => v !== newValue);
    }
    setValue(nextValue);
    const propsValue = nextValue.filter(v => v !== 'other');
    onChange && onChange(propsValue, otherValue);
  };

  const renderCheckboxGroup = data => {
    return data.map(item => {
      if (!item.childNodes) {
        const key = item.id + '';
        return (
          <div key={item.id}>
            <Checkbox value={key} onChange={handleChange} checked={value.includes(key)}>
              {item.desc}
            </Checkbox>
          </div>
        );
      }
      return (
        <div key={item.id}>
          <h4 style={{ paddingTop: 6, fontWeight: 700 }}>{item.desc}</h4>
          {item.childNodes.map(c => {
            const key = c.id + '';
            return (
              <div key={c.id}>
                <Checkbox value={key} onChange={handleChange} checked={value.includes(key)}>
                  {c.desc}
                </Checkbox>
              </div>
            );
          })}
        </div>
      );
    });
  };

  return (
    <Collapse bordered={false} defaultActiveKey={['other']}>
      {dataSource.map(item => (
        <Panel header={item.desc} key={item.id + ''}>
          {renderCheckboxGroup(item.childNodes)}
        </Panel>
      ))}

      <Panel header="其他原因" key="other">
        <Input
          type="textarea"
          value={otherValue}
          placeholder="请输入其它原因"
          onChange={e => {
            const propsValue = value.filter(v => v !== 'other');
            const otherValue = e.target.value;
            setValue([]);
            setOtherValue(otherValue);
            onChange && onChange(propsValue, otherValue);
          }}
        />
      </Panel>
    </Collapse>
  );
};

export default SelectReject;
