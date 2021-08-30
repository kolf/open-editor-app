import React, { useState, useEffect, useContext } from 'react';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { message } from 'antd';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import ImageDetails from 'src/components/modals/ImageDetails';
import ImageLogs from 'src/components/modals/ImageLogs';
import Loading from 'src/components/common/LoadingBlock';
import { DataContext } from 'src/components/contexts/DataProvider';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useKeywords } from 'src/hooks/useKeywords';
import imageService from 'src/services/imageService';
import config from 'src/config';
import modal from 'src/utils/modal';
import { getReasonTitle, getReasonMap } from 'src/utils/getReasonTitle';
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
  const [keywords] = useKeywords();
  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { run: getExif } = useRequest(imageService.getExif, { manual: true });
  const {
    data: { list, total } = initialData,
    loading,
    run,
    refresh
  } = useRequest(() => imageService.getList(formatQuery(query)), {
    ready: !!(providerOptions && categoryOptions && allReason),
    manual: true,
    throttleInterval: 600,
    formatResult
  });

  useEffect(() => {
    run();
    setSelectedIds([]);
  }, [query, keywords]);

  // 格式化查询参数
  const formatQuery = query => {
    let result = Object.keys(query).reduce((result, key) => {
      const value = query[key];
      if (/Time$/g.test(key) && value) {
        const [start, end] = value;
        result[key] = `${start.format(config.data.DATE_FORMAT)} 00:00:00,${end.format(
          config.data.DATE_FORMAT
        )} 23:59:59`;
        // const date = value.format(config.data.DATE_FORMAT);
        // result[key] = `${date} 00:00:00,${date} 23:59:59`;
      } else if (value && typeof value === 'object') {
        result[key] = value.key;
      } else if (value) {
        result[key] = value;
      }
      return result;
    }, {});

    if (keywords) {
      result['keyword'] = keywords;
      result['searchType'] = /^[\d,]*$/.test(keywords) ? '2' : '1';
    }

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
          const { qualityStatus, priority } = osiImageReview;
          const categoryList = (category || '').split(',');
          let reasonTitle = '';

          if (/^3/.test(qualityStatus) && (standardReason || customReason)) {
            reasonTitle = getReasonTitle(getReasonMap(allReason), standardReason, customReason);
          }

          return {
            ...item,
            priority,
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
      case 'logs':
        showLogs(index);
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

  // 显示中图
  const showMiddleImage = index => {
    const { urlSmall } = list[index];
    const mod = modal({
      title: `查看中图`,
      width: 640,
      content: (
        <div className="image-max">
          <img src={urlSmall} style={{ width: '100%' }} />
        </div>
      ),
      footer: null
    });
  };

  //  打开原图
  const openOriginImage = async index => {
    const idList = [list[index].id];
    idList.forEach(id => {
      const { urlYuan } = list.find(item => item.id === id);
      window.open(urlYuan);
    });
  };

  // 打开授权文件
  const openLicense = async index => {
    const { id } = list[index];
    window.open(`/image/license?id=${id}`);
  };
  // 操作日志
  const showLogs = async index => {
    const { id } = list[index];
    const res = await imageService.getLogList([id]);
    console.log(res, 'res');
    const mod = modal({
      title: `操作日志`,
      width: 640,
      content: <ImageLogs dataSource={res} />,
      footer: null
    });
  };

  // 显示详情
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
        onRefresh={refresh}
        pagerProps={{
          total,
          current: query.pageNum,
          pageSize: query.pageSize,
          onChange: values => {
            setQuery({ ...query, ...values });
          }
        }}
      />
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
