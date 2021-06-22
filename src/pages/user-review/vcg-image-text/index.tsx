import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { Radio, Button, Space, Spin, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import ImageDetails from 'src/components/modals/ImageDetails';
import SelectReject from 'src/components/modals/SelectReject';
import Loading from 'src/components/common/LoadingBlock';

import { useDocumentTitle } from 'src/hooks/useDom';
import { useCurrentUser } from 'src/hooks/useCurrentUser';

import imageService from 'src/services/imageService';
import commonService from 'src/services/commonService';

import options, { Quality, LicenseType } from 'src/declarations/enums/query';

import config from 'src/config';
import modal from 'src/utils/modal';
import confirm from 'src/utils/confirm';
import { getReasonTitle, reasonDataToMap } from 'src/utils/getReasonTitle';
// import {}

const qualityOptions = options.get(Quality);
const licenseTypeOptions = options.get(LicenseType);

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
  useDocumentTitle(`我的审核-VCG内容审核管理平台`);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const [selectedIds, setSelectedIds] = useState([]);
  const { partyId } = useCurrentUser();
  const { data: providerOptions } = useRequest(() => commonService.getOptions({ type: 'provider' }), {
    cacheKey: 'provider'
  });
  const { data: categoryOptions } = useRequest(() => commonService.getOptions({ type: 'category' }), {
    cacheKey: 'category'
  });
  const { data: allReason } = useRequest(commonService.getImageAllReason, {
    cacheKey: 'allReason'
  });
  const { run: review } = useRequest(imageService.qualityReview, { manual: true });
  const { run: update } = useRequest(imageService.update, { manual: true });
  const { run: getExif } = useRequest(imageService.getExif, { manual: true });
  const {
    data: { list, total },
    loading,
    mutate,
    run,
    refresh
  } = useRequest(() => imageService.getList(formatQuery(query)), {
    ready: !!(providerOptions && categoryOptions && allReason),
    manual: true,
    throttleInterval: 600,
    initialData,
    formatResult
  });

  useEffect(() => {
    run();
    setSelectedIds([]);
  }, [query]);

  // 格式化查询参数
  const formatQuery = query => {
    const result = Object.keys(query).reduce(
      (result, key) => {
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
      },
      {
        qualityAuditorId: partyId
      }
    );

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
      case 'resolve':
        setResolve(index);
        break;
      case 'reject':
        setReject(index);
        break;
      case 'license':
        openLicense(index);
        break;
      default:
        break;
    }
  };

  // 改变数据某一项的值
  const handleChange = (index, field, value) => {
    switch (field) {
      case 'qualityRank':
        setQuality(index, value);
        break;
      case 'licenseType':
        setLicenseType(index, value);
        break;
      case 'copyright':
        setCopyright(index, value);
        break;
      default:
        alert(field);
        break;
    }
  };

  const handleSelect = index => {
    const { id } = list[index];
    const nextSelectedIds = selectedIds.includes(id) ? selectedIds.filter(sid => sid !== id) : [...selectedIds, id];
    setSelectedIds(nextSelectedIds);
  };

  const checkSelectedIds = () => {
    if (selectedIds.length === 0) {
      throw '请选择图片！';
    }
    return [...selectedIds];
  };

  const showMiddleImage = index => {
    const { urlYuan } = list[index];
    const mod = modal({
      title: `查看中图`,
      width: 960,
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

  // 设置通过
  const setResolve = async index => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({ title: '图片通过', content: `请确认当前选中图片全部设置为通过吗?` });
      const imageList = list
        .filter(item => idList.includes(item.id))
        .map(item => ({
          ...item,
          osiImageReview: undefined,
          createdTime: undefined,
          updatedTime: undefined
        }));
      mod.confirmLoading();
      const res = await review({ body: imageList, query: { stage: 1, status: 1 } });
      mod.close();
      message.success(`设置通过成功！`);
      setSelectedIds([]);
      refresh();
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置不通过
  const setReject = async index => {
    let mod = null;
    let standardReason = [];
    let customReason = '';
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({
        width: 820,
        title: '设置不通过原因',
        bodyStyle: { padding: 0 },
        content: (
          <div style={{ margin: -24 }}>
            <SelectReject
              dataSource={allReason}
              onChange={(value, otherValue) => {
                standardReason = value;
                customReason = otherValue;
              }}
            />
          </div>
        )
      });

      if (standardReason.length === 0 && !customReason) {
        throw `请选择不通过原因！`;
      }

      const imageList = list
        .filter(item => idList.includes(item.id))
        .map(item => ({
          ...item,
          osiImageReview: undefined,
          createdTime: undefined,
          updatedTime: undefined
        }));

      mod.confirmLoading();
      const res = await review({
        body: imageList,
        query: { stage: 1, status: 2, standardReason: standardReason.join(','), customReason }
      });
      mod.close();
      message.success(`设置不通过成功！`);
      setSelectedIds([]);
      refresh();
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置等级
  const setQuality = async (index, value) => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({ title: '设置等级', content: `请确认当前选中图片设置为当前选中的质量等级吗?` });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '1', value } });
      mod.close();
      message.success(`设置等级成功！`);
      setSelectedIds([]);
      refresh();
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置授权类型
  const setLicenseType = async (index, value) => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({ title: '设置授权', content: `请确认当前选中图片设置为当前选中授权RF/RM吗?` });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '2', value } });
      mod.close();
      message.success(`设置授权成功！`);
      setSelectedIds([]);
      refresh();
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };
  // 设置授权
  const setCopyright = async (index, value) => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({ title: '设置授权', content: `请确认当前选中图片设置为当前选中授权RF/RM吗?` });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '3', value } });
      mod.close();
      message.success(`设置授权成功！`);
      setSelectedIds([]);
      refresh();
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  return (
    <>
      <FormList onChange={values => setQuery({ ...query, ...values, pageNum: 1 })} />
      <Toolbar
        onSelectIds={setSelectedIds}
        selectedIds={selectedIds}
        idList={list.map(item => item.id)}
        pagerProps={{
          total,
          current: query.pageNum,
          pageSize: query.pageSize,
          onChange: values => {
            setQuery({ ...query, ...values });
          }
        }}
      >
        <Space>
          <Button type="text" style={{ marginLeft: 8 }}>
            审核
          </Button>
          <Button title="通过" onClick={e => setResolve(-1)} icon={<CheckOutlined />} />
          <Button title="不通过" onClick={e => setReject(-1)} icon={<CloseOutlined />} />
          <Button type="text" style={{ marginLeft: 8 }}>
            编辑
          </Button>
          {licenseTypeOptions.map(o => (
            <Button title={`设置${o.label}`} onClick={e => setLicenseType(-1, o.value)}>
              {o.label}
            </Button>
          ))}

          {qualityOptions.map(o => (
            <Button title={`设置等级${o.label}`} key={o.value} onClick={e => setQuality(-1, o.value)}>
              {o.label}
            </Button>
          ))}
        </Space>
      </Toolbar>
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
