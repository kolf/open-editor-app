import React, { ReactElement, useState } from 'react';
import { Space } from 'antd';

interface Props<T> {
  value: T;
  onChange?: (value: T) => void;
  options: Option<T>[];
}

export default function RadioText<T>({ value, options, onChange }: Props<T>): ReactElement {
  return (
    <Space>
      {options.map(o => (
        <a
          key={o.value + ''}
          onClick={e => onChange(o.value)}
          style={value === o.value ? { color: '#e30e09', fontWeight: 700 } : { color: '#444444' }}
        >
          {o.label}
        </a>
      ))}
    </Space>
  );
}
