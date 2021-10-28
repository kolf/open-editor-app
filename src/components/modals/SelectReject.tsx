import * as React from 'react';
import { useSelector } from 'react-redux';
import { Collapse, Checkbox, Input, message } from 'antd';
import { useIntl } from 'react-intl';
import { RootState } from 'src/store';
const { Panel } = Collapse;

interface Props {
  dataSource: any; // TODO
  onChange?: (value: string[], otherValue: string) => void;
}

export default function SelectReject({ dataSource, onChange }: Props): React.ReactElement {
  const { formatMessage } = useIntl();
  const { language } = useSelector((state: RootState) => state.language);
  const [value, setValue] = React.useState([]);
  const [otherValue, setOtherValue] = React.useState('');
  const isEn = language === 'en-US';

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
              {item[isEn ? 'descEn' : 'desc']}
            </Checkbox>
          </div>
        );
      }
      return (
        <div key={item.id}>
          <h4 style={{ paddingTop: 6, fontWeight: 700 }}>{item[isEn ? 'descEn' : 'desc']}</h4>
          {item.childNodes.map(c => {
            const key = c.id + '';
            return (
              <div key={c.id}>
                <Checkbox value={key} onChange={handleChange} checked={value.includes(key)}>
                  {c[isEn ? 'descEn' : 'desc']}
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
        <Panel header={item[isEn ? 'descEn' : 'desc']} key={item.id + ''}>
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
}
