import React, { useState, useEffect, useContext } from 'react';
import { useRequest } from 'ahooks';
import { FetchResult } from '@ahooksjs/use-request/lib/types';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from 'src/components/FormList';
import ListItem from './ListItem';
import { DataContext } from 'src/components/contexts/DataProvider';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useHeaderSearch } from 'src/hooks/useHeaderSearch';
import useImage from 'src/hooks/useImage';
import { IFormItemKey } from 'src/hooks/useFormItems';
import imageService from 'src/services/imageService';
import config from 'src/config';

const initialData = {
  list: [],
  total: 0
};

export default React.memo(function List() {
  useDocumentTitle(`全部资源-VCG内容审核管理平台`);

  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });

  const {
    data: { list, total } = initialData,
    loading = true,
    run
  }: FetchResult<IImageResponse, any> = useRequest(() => imageService.getList(formatQuery(query)), {
    ready: !!(providerOptions && categoryOptions && allReason),
    throttleInterval: 600,
    formatResult: data => formatResult(data),
    refreshDeps: [query]
  });

  const [keywords] = useHeaderSearch(run);
  const { getReasonTitle, showDetails, showLogs, openLicense, showMiddleImage, openOriginImage } = useImage({ list });

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
            reasonTitle = getReasonTitle(standardReason, customReason);
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

  const onRefresh = () => {
    setQuery({ ...query, pageNum: 1 });
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

  const formItemKeys: IFormItemKey[] = React.useMemo(() => {
    return [
      3,
      1,
      2,
      4,
      { key: 5, options: providerOptions },
      15,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      { key: 13, options: categoryOptions }
    ];
  }, [categoryOptions, providerOptions]);

  return (
    <>
      <FormList itemKeys={formItemKeys} onChange={value => setQuery({ ...query, ...value, pageNum: 1 })} />
      <Toolbar
        onRefresh={onRefresh}
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
});
