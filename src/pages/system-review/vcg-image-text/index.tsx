import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { message } from 'antd';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import ImageDetails from 'src/components/modals/ImageDetails';
import Loading from 'src/components/common/LoadingBlock';
import { useDocumentTitle } from 'src/hooks/useDom';
import imageService from 'src/services/imageService';
import commonService from 'src/services/commonService';
import config from 'src/config';
import modal from 'src/utils/modal';
interface listProps {
  // TODO: 添加图片接口
  list?: any;
  total?: number;
}

const initialData = {
  list: [],
  total: 0
};

function List() {
  useDocumentTitle(`全部资源-VCG内容审核管理平台`);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const [selectedIds, setSelectedIds] = useState([]);
  const { data: providerOptions } = useRequest(() => commonService.getOptions({ type: 'provider' }), {
    cacheKey: 'provider',
    manual: true
  });
  const { data: categoryOptions } = useRequest(() => commonService.getOptions({ type: 'category' }), {
    cacheKey: 'category',
    manual: true
  });
  const { run: showExifDetails } = useRequest(imageService.getExif, { manual: true });
  const { data, loading, error, run, refresh } = useRequest(imageService.getList, {
    manual: true,
    throttleInterval: 600,
    initialData
  });
  const { list, total } = makeData(data);

  useEffect(() => {
    run(makeQuery(query));
    setSelectedIds([]);
  }, [query]);

  // 格式化查询参数
  const makeQuery = query => {
    const result = Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (/Time$/g.test(key) && value) {
        const date = value.format(config.data.DATE_FORMAT);
        result[key] = `${date} 00:00:00,${date} 23:59:59`;
      } else if (key === 'keyword' && value) {
        let searchType = '1';
        result['searchType'] = searchType;
        result[key] = value;
      } else if (value && typeof value === 'object') {
        result[key] = value.key;
      } else if (value) {
        result[key] = value;
      }
      return result;
    }, {});

    return result;
  };

  // 格式化返回的数据
  function makeData(data: listProps): listProps {
    if (!data) {
      return initialData;
    }
    try {
      return {
        total: data.total,
        list: data.list.map(item => {
          const {
            createdTime,
            updatedTime,
            osiImageReview,
            qualityRank,
            copyright,
            licenseType,
            osiProviderId,
            category
          } = item;
          const categoryList = category.split(',');

          return {
            ...item,
            qualityStatus: osiImageReview.qualityStatus,
            copyright: copyright + '',
            qualityRank: qualityRank ? qualityRank + '' : undefined,
            licenseType: licenseType + '' || undefined,
            osiProviderName: providerOptions.find(o => o.value === osiProviderId + '').label,
            categoryNames: categoryOptions
              .filter((o, index) => categoryList.includes(o.value) && index < 2)
              .map(o => o.label)
              .join(','),
            createdTime: moment(createdTime).format(config.data.SECOND_MINUTE),
            updatedTime: moment(updatedTime).format(config.data.SECOND_MINUTE)
          };
        })
      };
    } catch (error) {
      return data;
    }
  }

  // 点击某一项数据
  const handleClick = (index, field) => {
    switch (field) {
      case 'id':
        showDetails(index);
        break;
      case 'cover':
        handleSelect(index);
        break;
      case 'license':
        openLicense(index);
        break;
      default:
        break;
    }
  };

  // 改变数据某一项的值
  const handleChange = (index, field, value) => {};

  const handleSelect = index => {};

  const openLicense = async index => {
    const { id } = list[index];
    window.open(`/image/license?id=${id}`);
  };

  const showDetails = async index => {
    const { id, urlSmall, urlYuan } = list[index];
    const mod = modal({
      title: `图片详情`,
      width: 640,
      content: <Loading />,
      footer: null
    });
    try {
      const res = await showExifDetails({ id });
      mod.update({
        content: <ImageDetails dataSource={{ ...res, imgUrl: urlSmall, urlYuan }} />
      });
    } catch (error) {
      message.error(`请求接口出错！`);
      mod.close();
    }
  };

  return (
    <>
      <FormList onChange={values => setQuery({ ...query, ...values, pageNum: 1 })} />
      <Toolbar
        onSelectIds={setSelectedIds}
        selectedIds={selectedIds}
        idList={list.map(item => item.id)}
        dataTotal={total}
      ></Toolbar>
      <GridList
        loading={loading}
        dataSource={list}
        renderItem={(item, index) => (
          <ListItem
            selected={selectedIds.includes(item.id)}
            dataSource={item}
            index={index}
            onClick={field => handleClick(index, field)}
            onChange={(field, value) => handleChange(index, field, value)}
          />
        )}
      />
    </>
  );
}

export default List;
