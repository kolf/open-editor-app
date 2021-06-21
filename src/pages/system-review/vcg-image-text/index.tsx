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
import { getReasonTitle, reasonDataToMap } from 'src/utils/getReasonTitle';
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
    cacheKey: 'provider'
  });
  const { data: categoryOptions } = useRequest(() => commonService.getOptions({ type: 'category' }), {
    cacheKey: 'category'
  });
  const { data: allReason } = useRequest(commonService.getImageAllReason, {
    cacheKey: 'allReason'
  });
  const { run: getExif } = useRequest(imageService.getExif, { manual: true });
  const {
    data: { list, total },
    loading,
    mutate,
    run,
    refresh
  } = useRequest(
    async () => {
      const res1 = await imageService.getList(makeQuery(query));
      console.log(res1, 'res');
      return res1;
    },
    {
      ready: !!(providerOptions && categoryOptions && allReason),
      manual: true,
      throttleInterval: 600,
      initialData,
      formatResult
    }
  );

  useEffect(() => {
    run();
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
  function formatResult(data: listProps): listProps {
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
            category,
            standardReason,
            customReason
          } = item;
          const qualityStatus = osiImageReview.qualityStatus;
          const categoryList = category.split(',');
          let reasonTitle = '';

          if (/^3/.test(qualityStatus) && (standardReason || customReason)) {
            reasonTitle = getReasonTitle(reasonDataToMap(allReason), standardReason, customReason);
          }

          return {
            ...item,
            qualityStatus,
            copyright: copyright + '',
            qualityRank: qualityRank ? qualityRank + '' : undefined,
            licenseType: licenseType + '' || undefined,
            reasonTitle,
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
      console.log(error, 'error');
      return data;
    }
  }

  // 点击某一项数据
  const handleClick = (index, field) => {
    console.log(field, 'urlYuan');
    switch (field) {
      case 'id':
        showDetails(index);
        break;
      case 'cover':
        handleSelect(index);
        break;
      case 'showMiddleImage':
        showMiddleImage(index);
        break;
      case 'openOriginImage':
        openOriginImage(index);
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

  const showMiddleImage = index => {
    const { urlYuan } = list[index];
    const mod = modal({
      title: `查看中图`,
      width: 640,
      content: (
        <div className="image-max">
          <img src={urlYuan} />
        </div>
      ),
      footer: null
    });
  };

  const openOriginImage = index => {
    const { urlYuan } = list[index];
    window.open(urlYuan);
  };

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
      const res = await getExif({ id });
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
