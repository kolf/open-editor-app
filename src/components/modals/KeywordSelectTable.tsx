import React, { useEffect, useRef, useCallback, useState, ReactElement } from 'react';
import { Table } from 'antd';

interface Props {
  dataSource: Array<any>;
  onChange: (value: Array<number>) => void;
}

const defaultKinds = [
  {
    label: '主题',
    value: '0'
  },
  {
    label: '概念',
    value: '1'
  },
  {
    label: '规格',
    value: '2'
  },
  {
    label: '人物',
    value: '3'
  },
  {
    label: '地点',
    value: '4'
  }
];

export default function KeywordSelectTable({ onChange, dataSource }: Props): ReactElement {
  const [value, setValue] = useState([]);

  useEffect(() => {
    onChange(value);
  }, [value]);

  function handleClick({ id }) {
    const nextValue = value.find(v => v === id) ? value.filter(v => v !== id) : [...value, id];
    setValue(nextValue);
  }

  const columns = [
    {
      title: '中文名',
      dataIndex: 'cnname',
      key: 'cnname',
      width: 100
    },
    {
      title: '中文同义词',
      dataIndex: 'cnsyno',
      key: 'cnsyno',
      width: 200,
      render: text => text && text.join(';')
    },
    {
      title: '英文名',
      dataIndex: 'enname',
      key: 'enname',
      width: 100
    },
    {
      title: '英文同义词',
      dataIndex: 'ensyno',
      key: 'ensyno',
      width: 200,
      render: text => text.join(';')
    },
    {
      title: '类型 ',
      dataIndex: 'kind',
      key: 'kind',
      width: 50,
      render: text =>
        defaultKinds.reduce((result, kind) => {
          result[kind.value] = kind.label;
          return result;
        }, {})[text] || '---'
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 50
    }
  ];

  return (
    <Table
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      rowSelection={{
        selectedRowKeys: value,
        onChange: setValue
      }}
      onRow={record => {
        return {
          onClick() {
            handleClick(record);
          }
        };
      }}
      size="small"
      rowKey="id"
    />
  );
}
