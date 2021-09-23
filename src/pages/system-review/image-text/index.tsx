import React, { useState, useEffect, useContext } from 'react';
import { useRequest } from 'ahooks';
import { FetchResult } from '@ahooksjs/use-request/lib/types';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import { DataContext } from 'src/components/contexts/DataProvider';
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

  const {
    data: { list, total } = initialData,
    loading = true,
    refresh
  }: FetchResult<IImageResponse, any> = useRequest(() => imageService.getList(formatQuery(query)), {
    ready: !!(providerOptions && categoryOptions && allReason),
    throttleInterval: 600,
    formatResult: data => formatResult(data),
    refreshDeps: [query, keywords]
  });

  const { showDetails, showLogs, openLicense, showMiddleImage, openOriginImage } = useImage({ list });

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

    if (!query.qualityStatus) {
      result['qualityStatus'] = '14,24,34';
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
          const {
            osiImageReview,
            osiProviderId,
            category,
            standardReason,
            customReason,
            copyright,
            qualityRank,
            licenseType
          } = item;
          const categoryList: IImage['categoryNames'][] = (category || '')
            .split(',')
            .filter((item, index) => item && index < 2);
          let reasonTitle: IImage['reasonTitle'] = '';

          if (/^3/.test(osiImageReview.qualityStatus) && (standardReason || customReason)) {
            reasonTitle = getReasonTitle(reasonMap, standardReason, customReason);
          }

          return {
            ...item,
            copyright: (copyright + '') as IImage['copyright'],
            qualityRank: qualityRank ? ((qualityRank + '') as IImage['qualityRank']) : undefined,
            licenseType: (licenseType + '') as IImage['licenseType'],
            reasonTitle,
            osiProviderName: providerOptions.find(o => o.value === osiProviderId + '').label,
            categoryNames: categoryOptions
              .filter((o, index) => categoryList.includes(o.value + ''))
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
      />
      <GridList<IImage>
        loading={loading}
        dataSource={list}
        renderItem={(item, index) => <ListItem dataSource={item} index={index} onClick={handleClick} />}
      />
    </>
  );
}

export default List;
