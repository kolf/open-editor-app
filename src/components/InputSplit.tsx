import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { Dropdown, Input, InputNumber, Menu } from 'antd';

interface Props {
  placeholder: string;
  onChange?: (value: string) => void;
}

export default React.memo(function InputSplit({ placeholder, onChange }: Props): ReactElement {
  const [minValue, setMinValue] = useState<number>();
  const [maxValue, setMaxValue] = useState<number>();

  useEffect(() => {
    handleChange();

    function handleChange() {
      if (minValue !== undefined && maxValue !== undefined) {
        onChange(`${minValue},${maxValue}`);
      }
    }
  }, [minValue, maxValue]);

  const hasValue = minValue !== undefined || maxValue !== undefined;

  return (
    <Input.Group compact style={{ border: '1px solid #d9d9d9', overflow: 'hidden', width: 170, height: 32 }}>
      <InputNumber
        value={minValue}
        onChange={value => setMinValue(value)}
        step={0.1}
        min={0}
        max={10}
        bordered={false}
        style={{ width: hasValue ? 80 : 180, textAlign: 'center' }}
        placeholder={hasValue ? '最小值' : placeholder}
      />
      {hasValue && <span style={{ paddingTop: 4, width: 10 }}>~</span>}
      {hasValue && (
        <InputNumber
          value={maxValue}
          onChange={value => setMaxValue(value)}
          step={0.1}
          min={minValue || 0}
          max={10}
          bordered={false}
          placeholder="最大值"
          style={{
            width: 80,
            textAlign: 'center',
            borderLeftWidth: 0
          }}
        />
      )}
    </Input.Group>
  );
});