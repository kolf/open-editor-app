import React, { useState, useEffect } from 'react';
import { Collapse, Checkbox, Input, message } from 'antd';
import { useIntl } from 'react-intl';
const { Panel } = Collapse;

interface Props {
  dataSource: any; // TODO
  onChange?: (value: string[], otherValue: string) => void;
}

const SelectReject = ({ dataSource, onChange }: Props) => {
  const { formatMessage } = useIntl();
  const [value, setValue] = useState([]);
  const [otherValue, setOtherValue] = useState('');

  const handleChange = e => {
    const { checked, value: newValue } = e.target;
    setOtherValue('');
    let nextValue = [];
    if (checked) {
      if (value.length >= 3) {
        message.info(formatMessage({ id: 'selectRejct.error' }));
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

      <Panel header={formatMessage({ id: 'selectReject.otherValue' })} key="other">
        <Input
          type="textarea"
          value={otherValue}
          placeholder={formatMessage({ id: 'input.placeholder' })}
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
