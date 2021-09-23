import React, { useState, useContext } from 'react';
import { useRequest } from 'ahooks';
import { FetchResult } from '@ahooksjs/use-request/lib/types';
import { Radio } from 'antd';
import { LineOutlined, FileSearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import { DataContext } from 'src/components/contexts/DataProvider';
import { ModeType as KeywordModeType } from 'src/components/KeywordTextAreaGroup';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useSearchValue } from 'src/hooks/useSearchValue';
import useImage from 'src/hooks/useImage';
import imageService from 'src/services/imageService';
import config from 'src/config';
import { getReasonTitle, getReasonMap } from 'src/utils/getReasonTitle';

const initialData = {
  list: [],
  total: 0
};

function List() {
  useDocumentTitle(`全部资源-VCG内容审核管理平台`);
  const [keywords] = useSearchValue();
  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const reasonMap = getReasonMap(allReason);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const [keywordMode, setKeywordMode] = useState<KeywordModeType>('all');

  const {
    data: { list, total } = initialData,
    loading = true,
    refresh
  }: FetchResult<IImageResponse, any> = useRequest(
    async () => {
      const res = await imageService.getList(formatQuery(query));
      let nextList = await imageService.getKeywordTags(res.list);

      return {
        total: res.total,
        list: nextList
      };
    },
    {
      ready: !!(providerOptions && categoryOptions && allReason),
      throttleInterval: 600,
      formatResult: data => formatResult(data),
      refreshDeps: [query, keywords]
    }
  );

  const { showDetails, showLogs, openLicense, showMiddleImage, openOriginImage } = useImage({
    list
  });

  // 格式化查询参数
  const formatQuery = query => {
    let result = Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (/Time$/g.test(key) && value) {
        const [start, end] = value;
        result[key] = `${start.format(config.data.DATE_FORMAT)} 00:00:00,${end.format(
          config.data.DATE_FORMAT
        )} 23:59:59`;
      } else if (value && typeof value === 'object') {
        result[key] = value.key;
      } else if (value) {
        result[key] = value;
      }
      return result;
    }, {});

    if (!query.keywordsStatus) {
      result['keywordsStatus'] = '14,24,34';
    }

    if (keywords) {
      result['keyword'] = keywords;
      result['searchType'] = /^[\d,]*$/.test(keywords) ? '2' : '1';
    }

    return result;
  };

  // 格式化返回的数据
  const formatResult = (data: IImageResponse): IImageResponse => {
    try {
      return {
        total: data.total,
        list: data.list.map(item => {
          const { osiImageReview, osiProviderId, category, standardReason, customReason } = item;
          const categoryList: IImage['categoryNames'][] = (category || '')
            .split(',')
            .filter((item, index) => item && index < 2);
          let reasonTitle: IImage['reasonTitle'] = '';

          if (/^3/.test(osiImageReview.keywordsStatus) && (standardReason || customReason)) {
            reasonTitle = getReasonTitle(reasonMap, standardReason, customReason);
          }

          return {
            ...item,
            reasonTitle,
            osiProviderName: providerOptions.find(o => o.value === osiProviderId + '').label,
            categoryNames: categoryOptions
              .filter(o => categoryList.includes(o.value + ''))
              .map(o => o.label)
              .join(',')
          };
        })
      };
    } catch (error) {
      return data;
    }
  };

  // 点击某一项数据
  const handleClick = (index: number, field: IImageActionType) => {
    switch (field) {
      case 'id':
        showDetails(index);
        break;
      case 'middleImage':
        showMiddleImage(index);
        break;
      case 'originImage':
        openOriginImage(index);
        break;
      case 'logs':
        showLogs(index);
        break;
      case 'releases':
        openLicense(index);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <FormList onChange={value => setQuery({ ...query, ...value, pageNum: 1 })} />
      <Toolbar
        onRefresh={refresh}
        pagerProps={{
          total,
          current: query.pageNum,
          pageSize: query.pageSize,
          onChange: value => {
            setQuery({ ...query, ...value });
          }
        }}
        extraContent={
          <Radio.Group
            size="small"
            defaultValue="all"
            onChange={e => {
              setKeywordMode(e.target.value);
            }}
          >
            <Radio.Button value="all">
              <LineOutlined title="展示全部" />
            </Radio.Button>
            <Radio.Button value="source">
              <FileSearchOutlined title="按来源展示" />
            </Radio.Button>
            <Radio.Button value="kind">
              <UnorderedListOutlined title="按类型展示" />
            </Radio.Button>
          </Radio.Group>
        }
      />
      <GridList<IImage>
        loading={loading}
        dataSource={list}
        renderItem={(item, index) => (
          <ListItem keywordMode={keywordMode} dataSource={item} index={index} onClick={handleClick} />
        )}
      />
    </>
  );
}

export default List;
