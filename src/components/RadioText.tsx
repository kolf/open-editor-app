import React, { ReactElement, useState } from 'react';
import { Space } from 'antd';

interface Props {
  value: string;
  onChange: any;
  // TODO
  options: any;
}

export default function RadioText({ value, options, onChange }: Props): ReactElement {
  return (
    <Space>
      {options.map(o => (
        <a key={o.value} onClick={e => onChange(o.value)} style={{ color: value === o.value ? '#ff0000' : '#333333' }}>
          {o.label}
        </a>
      ))}
    </Space>
  );
}
