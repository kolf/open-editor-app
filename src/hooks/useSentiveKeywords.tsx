import React, { ReactElement } from 'react';
import { Table } from 'antd';
import modal from 'src/utils/modal';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 50
  },
  {
    title: '敏感词',
    dataIndex: 'first_word'
  },
  {
    title: '同义词',
    dataIndex: 'first_syno_sensitive',
    width: 210
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '组合词',
    dataIndex: 'second_word'
  },
  {
    title: '组合词同义词',
    dataIndex: 'second_syno_sensitive',
    width: 90
  }
];

export function parse(dataSource) {
  if (!dataSource || !Array.isArray(dataSource)) {
    return null;
  }
  return dataSource.reduce((result, item) => {
    if (!item) {
      return result;
    }
    if (/^(0|1)$/.test(item.checkType)) {
      const value = (item.elephantSensitiveWord || '').replace(/(^,+|,+$)/g, '').replace(/,{1,}/g, ',');
      if (result[item.elephantCategoryTitle]) {
        result[item.elephantCategoryTitle].push(value);
      } else {
        result[item.elephantCategoryTitle] = [value];
      }
    } else {
      const value = (item.sensitiveWord || '').replace(/(^,+|,+$)/g, '').replace(/,{1,}/g, ',');
      if (result[item.sensitiveLabelTxt]) {
        result[item.sensitiveLabelTxt].push(value);
      } else {
        result[item.sensitiveLabelTxt] = [value];
      }
    }
    return result;
  }, {});
}

export function stringify(dataSource) {
  const data = parse(dataSource);
  if (!data) {
    return '';
  }
  return Object.keys(data)
    .reduce((result, key) => {
      const value = data[key].join(',');
      if (value) {
        result.push(`${key}：${value}`);
      } else {
        result.push(key);
      }
      return result;
    }, [])
    .join('\n\b');
}

export const useSentiveKeywords = dataSource => {
  const text = stringify(dataSource);

  const show = () => {
    modal({
      width: 840,
      title: '查看敏感词',
      content: <Table columns={columns} dataSource={dataSource} rowKey="id" size="small" pagination={false} />,
      footer: null
    });
  };
  // const [state, setstate] = useState(initialState)
  return [text, show];
};
