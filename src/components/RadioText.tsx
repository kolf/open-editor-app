import React, { ReactElement, useState } from 'react';
import { Space } from 'antd';

interface Props {
  value: string;
  onChange: any;
  // TODO
  options: any;
}

const defaultProps = {
  onChange() {}
};

function RadioText({ value, options, onChange }: Props): ReactElement {
  return (
    <Space>
      {options.map(o => (
        <a
          key={o.value}
          onClick={e => onChange(o.value)}
          style={value === o.value ? { color: '#e30e09', fontWeight: 700 } : { color: '#444444'}}
        >
          {o.label}
        </a>
      ))}
    </Space>
  );
}

RadioText.defaultProps = defaultProps;

export default RadioText;
