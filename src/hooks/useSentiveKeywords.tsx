import React, { ReactElement } from 'react';
import { Table } from 'antd';
import modal from 'src/utils/modal';
import imageService from 'src/services/imageService';
import Loading from 'src/components/common/LoadingBlock';

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
    title: '分类',
    dataIndex: 'category'
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
    width: 110
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

export function stringify(dataSource): string {
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
    .join('，');
}

export const useSentiveKeywords = dataSource => {
  const text: string = stringify(dataSource);

  const showDetails = async () => {
    const mod = modal({
      width: 960,
      title: '查看敏感词',
      content: <Loading />,
      footer: null
    });
    let data = [];
    try {
      data = await imageService.getSentiveWordDetails(dataSource).then(res =>
        res.map(item => {
          if (/^(0|1)$/.test(item.checkType)) {
            return {
              ...item,
              category: item.category ? item.category[0].title : ''
            };
          } else {
            return {
              first_word: item.sensitiveWord,
              category: item.sensitiveLabelTxt
            };
          }
        })
      );
    } catch (error) {}
    mod.update({
      content: <Table columns={columns} dataSource={data} rowKey="id" size="small" pagination={false} />
    });
  };
  // const [state, setstate] = useState(initialState)
  return [text, showDetails];
};
