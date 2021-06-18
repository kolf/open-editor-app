import React, { useState } from 'react';
import { Collapse, Checkbox, Input } from 'antd';
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
    let nextValue = [];
    if (checked) {
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
        return (
          <div key={item.id}>
            <Checkbox value={item.id} onChange={handleChange} checked={value.includes(item.id)}>
              {item.desc}
            </Checkbox>
          </div>
        );
      }
      return (
        <div key={item.id}>
          <h4 style={{ paddingTop: 6, fontWeight: 700 }}>{item.desc}</h4>
          {item.childNodes.map(c => (
            <div key={c.id}>
              <Checkbox value={c.id} onChange={handleChange} checked={value.includes(c.id)}>
                {c.desc}
              </Checkbox>
            </div>
          ))}
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
            setOtherValue(otherValue);
            onChange && onChange(propsValue, otherValue);
          }}
        />
      </Panel>
    </Collapse>
  );
};

export default SelectReject;
