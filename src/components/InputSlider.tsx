import React, { ReactElement, useState } from 'react';
import { Dropdown, Input, Slider, Menu } from 'antd';
import { useDebounceFn } from 'ahooks';

interface Props {
  placeholder: string;
  value?: string;
  onChange?: any;
  width?: number;
}

export default function InputSlider({ placeholder, width, value, onChange }: Props): ReactElement {
  const [visible, setVisible] = useState(false);
  const { run } = useDebounceFn(
    newValue => {
      const propsValue = newValue.join(',');
      onChange(propsValue);
    },
    {
      wait: 900
    }
  );

  const splitValue = value => {
    return value ? value.split(',') : [0, 1];
  };

  const handleChange = e => {
    if (e.target.value && !value) {
      return;
    }
    // DOTO 清空有bug
    if (e.target.value === '' && value) {
      onChange();
    }
  };

  const menu = (
    <Menu style={{ width: 400, paddingLeft: 12, paddingRight: 12 }}>
      <Slider
        range
        defaultValue={splitValue(value)}
        step={0.01}
        min={0}
        max={1}
        onChange={run}
        // tooltipVisible={visible}
      />
    </Menu>
  );

  return (
    <Dropdown placement="bottomCenter" arrow overlay={menu} onVisibleChange={setVisible}>
      <Input placeholder={placeholder} value={value} style={{ width }} allowClear onChange={handleChange} />
    </Dropdown>
  );
}
