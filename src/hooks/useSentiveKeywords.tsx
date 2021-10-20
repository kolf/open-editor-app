import * as React from 'react';
import { Table } from 'antd';
import modal from 'src/utils/modal';
import imageService from 'src/services/imageService';
import Loading from 'src/components/common/LoadingBlock';
import { useIntl } from 'react-intl';

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
  const { formatMessage } = useIntl();
  const text: string = stringify(dataSource);

  const columns = [
    {
      title: formatMessage({ id: 'sensitiveWords.id' }),
      dataIndex: 'id',
      width: 50
    },
    {
      title: formatMessage({ id: 'sensitiveWords.keyword' }),
      dataIndex: 'first_word'
    },
    {
      title: formatMessage({ id: 'sensitiveWords.synoKeyword' }),
      dataIndex: 'first_syno_sensitive',
      width: 210
    },
    {
      title: formatMessage({ id: 'sensitiveWords.category' }),
      dataIndex: 'category'
    },
    {
      title: formatMessage({ id: 'sensitiveWords.notes' }),
      dataIndex: 'remark'
    },
    {
      title: formatMessage({ id: 'sensitiveWords.groupKeyword' }),
      dataIndex: 'second_word'
    },
    {
      title: formatMessage({ id: 'sensitiveWords.groupSynoKeyword' }),
      dataIndex: 'second_syno_sensitive',
      width: 110
    }
  ];

  const showDetails = React.useCallback(async () => {
    const mod = modal({
      width: 960,
      title: formatMessage({ id: 'sensitiveWords.title' }),
      content: <Loading />,
      footer: null
    });
    let data = [];
    try {
      data = await imageService.getSentiveWord(dataSource).then(res =>
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
  }, [dataSource]);
  // const [state, setstate] = useState(initialState)
  return [text, showDetails];
};
