import React, { useEffect, useRef, useCallback, useState, ReactElement } from 'react';
import { Table } from 'antd';
import { useIntl } from 'react-intl';

interface Props {
  dataSource: Array<any>;
  onChange: (value: Array<number>) => void;
}

const kinds: IKeywordsTag['kind'][] = [0, 1, 2, 3, 4];

export default React.memo(function KeywordSelectTable({ onChange, dataSource }: Props): ReactElement {
  const { formatMessage } = useIntl();
  const [value, setValue] = useState([]);
  const kindOptions = kinds.map(kind => ({
    value: kind,
    label: formatMessage({ id: `keywords.kind.${kind}` })
  }));

  useEffect(() => {
    onChange(value);
  }, [value]);

  function handleClick({ id }) {
    const nextValue = value.find(v => v === id) ? value.filter(v => v !== id) : [...value, id];
    setValue(nextValue);
  }

  const columns = [
    {
      title: formatMessage({ id: 'keywords.details.cnname' }),
      dataIndex: 'cnname',
      key: 'cnname',
      width: 100
    },
    {
      title: formatMessage({ id: 'keywords.details.cnsyno' }),
      dataIndex: 'cnsyno',
      key: 'cnsyno',
      width: 200,
      render: text => text && text.join(';')
    },
    {
      title: formatMessage({ id: 'keywords.details.enname' }),
      dataIndex: 'enname',
      key: 'enname',
      width: 100
    },
    {
      title: formatMessage({ id: 'keywords.details.ensyno' }),
      dataIndex: 'ensyno',
      key: 'ensyno',
      width: 200,
      render: text => text.join(';')
    },
    {
      title: formatMessage({ id: 'keywords.details.kind' }),
      dataIndex: 'kind',
      key: 'kind',
      width: 50,
      render: text =>
        kindOptions.reduce((result, kind) => {
          result[kind.value] = kind.label;
          return result;
        }, {})[text] || '---'
    },
    {
      title: formatMessage({ id: 'keywords.details.memo' }),
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
});
