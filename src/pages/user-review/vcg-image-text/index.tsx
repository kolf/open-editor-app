import React, { useState, useEffect, useContext } from 'react';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { Radio, Button, Space, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Iconfont from 'src/components/Iconfont';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import SelectReject from 'src/components/modals/SelectReject';
import { DataContext } from 'src/components/contexts/DataProvider';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useKeywords } from 'src/hooks/useKeywords';
import useImage from 'src/hooks/useImage';
import imageService from 'src/services/imageService';

import options, { Quality, LicenseType, CopyrightType } from 'src/declarations/enums/query';

import config from 'src/config';
import confirm from 'src/utils/confirm';
import { getReasonTitle, getReasonMap } from 'src/utils/getReasonTitle';

const qualityOptions = options.get(Quality);
const licenseTypeOptions = options.get(LicenseType);
const copyrightOptions = options.get(CopyrightType);

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
  const { partyId } = useCurrentUser();
  const [keywords] = useKeywords();
  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const reasonMap = getReasonMap(allReason);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60, qualityStatus: '14' });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { run: review } = useRequest(imageService.qualityReview, { manual: true, throwOnError: true });
  const { run: update } = useRequest(imageService.update, { manual: true, throwOnError: true });

  const {
    data: { list, total } = initialData,
    loading,
    mutate,
    run,
    refresh
  } = useRequest(
    async () => {
      const res = await imageService.getList(formatQuery(query));
      return res;
    },
    {
      ready: !!(providerOptions && categoryOptions && allReason),
      manual: true,
      throttleInterval: 600,
      formatResult
    }
  );

  const { showDetails, showLogs, openLicense, showMiddleImage } = useImage(list);

  useEffect(() => {
    run();
    setSelectedIds([]);
  }, [query, keywords]);
  // 格式化查询参数
  const formatQuery = query => {
    let result = Object.keys(query).reduce(
      (result, key) => {
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
      },
      {
        qualityAuditorId: partyId
      }
    );

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
            customReason,
            memo
          } = item;
          const { qualityStatus, priority, callbackStatus, qualityEditTime } = osiImageReview;
          const categoryList = (category || '').split(',').filter((item, index) => item && index < 2);
          let reasonTitle = '';

          if (/^3/.test(qualityStatus) && (standardReason || customReason)) {
            reasonTitle = getReasonTitle(reasonMap, standardReason, customReason);
          }

          return {
            tempData: {
              memo
            },
            ...item,
            priority,
            qualityStatus,
            qualityEditTime,
            callbackStatus,
            copyright: copyright + '',
            qualityRank: qualityRank ? qualityRank + '' : undefined,
            licenseType: licenseType + '' || undefined,
            reasonTitle,
            osiProviderName: providerOptions.find(o => o.value === osiProviderId + '').label,
            categoryNames: categoryOptions
              .filter((o, index) => categoryList.includes(o.value))
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
      case 'resolve':
        setResolve(index);
        break;
      case 'reject':
        setReject(index);
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

  const setList = (ids, props) => {
    const idList = ids || [...selectedIds];
    const nextList = list.map(item => {
      if (idList?.includes(item.id)) {
        return {
          ...item,
          ...props
        };
      }
      return item;
    });
    mutate({
      total,
      list: nextList
    });
  };

  const handleSelect = index => {
    const { id } = list[index];
    const nextSelectedIds = selectedIds.includes(id) ? selectedIds.filter(sid => sid !== id) : [...selectedIds, id];
    setSelectedIds(nextSelectedIds);
  };

  const checkSelectedIds = () => {
    if (selectedIds.length === 0) {
      // TODO 使用throw不合理
      throw '请选择图片！';
    }
    return [...selectedIds];
  };

  //  打开原图
  const openOriginImage = async index => {
    const idList = index === -1 ? checkSelectedIds() : [list[index].id];
    idList.forEach(id => {
      const { urlYuan } = list.find(item => item.id === id);
      window.open(urlYuan);
    });
  };

  // 设置通过
  const setResolve = async index => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({ title: '图片通过', content: `请确认当前选中图片全部设置为通过吗?` });
      const imageList = list
        .filter(item => idList.includes(item.id) && item.callbackStatus !== 2)
        .map(item => ({
          ...item,
          osiImageReview: undefined,
          createdTime: undefined,
          updatedTime: undefined
        }));
      if (imageList.length === 0) {
        mod.close();
        return;
      }
      mod.confirmLoading();
      const res = await review({ body: imageList, query: { stage: 1, status: 1 } });
      mod.close();
      message.success(`设置通过成功！`);
      setList(idList, {
        reasonTitle: '',
        callbackStatus: 2,
        qualityStatus: '24'
      });
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
        message.info(`请选择不通过原因！`);
        return;
      }

      const imageList = list
        .filter(item => idList.includes(item.id) && item.callbackStatus !== 2)
        .map(item => ({
          ...item,
          callbackStatus: 2,
          osiImageReview: undefined,
          createdTime: undefined,
          updatedTime: undefined
        }));

      if (imageList.length === 0) {
        mod.close();
        return;
      }

      mod.confirmLoading();
      const res = await review({
        body: imageList,
        query: { stage: 1, status: 2, standardReason: standardReason.join(','), customReason }
      });
      mod.close();
      message.success(`设置不通过成功！`);
      setList(idList, {
        reasonTitle: getReasonTitle(reasonMap, standardReason, customReason),
        qualityStatus: '34'
      });
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置等级
  const setQualityList = async (index, value) => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({ title: '设置等级', content: `请确认当前选中图片设置为当前选中的质量等级吗?` });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '1', value } });
      mod.close();
      message.success(`设置等级成功！`);
      setList(idList, {
        qualityRank: value
      });
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置授权类型
  const setLicenseTypeList = async (index, value) => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({ title: '设置授权', content: `请确认当前选中图片设置为当前选中授权RF/RM吗?` });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '2', value } });
      mod.close();
      message.success(`设置授权成功！`);
      setList(idList, {
        licenseType: value
      });
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置授权
  const setCopyrightList = async index => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      let value = '';
      mod = await confirm({
        title: '设置授权',
        content: (
          <Radio.Group
            onChange={e => {
              value = e.target.value;
            }}
          >
            <Space direction="vertical">
              {copyrightOptions.map(o => (
                <Radio value={o.value} key={o.value}>
                  {o.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )
      });
      if (!value) {
        message.info(`请选择授权！`);
        return;
      }
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '3', value: value } });
      mod.close();
      message.success(`设置授权成功！`);
      setList(idList, {
        copyright: value
      });
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  const setMemoList = async index => {
    // setMemo
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      let value = '';
      mod = await confirm({
        title: '设置备注',
        content: <Input placeholder="请输入备注信息" onChange={e => (value = e.target.value)} />
      });

      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '4', memo: value } });
      mod.close();
      message.success(`设置授权成功！`);
      setList(idList, {
        memo: value
      });
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  return (
    <>
      <FormList onChange={values => setQuery({ ...query, ...values, pageNum: 1 })} initialValues={query} />
      <Toolbar
        onSelectIds={setSelectedIds}
        onRefresh={() => {
          refresh();
          setSelectedIds([]);
        }}
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
          <Button size="small" type="text" style={{ marginLeft: 8 }}>
            审核
          </Button>
          <Button size="small" title="通过" onClick={e => setResolve(-1)} icon={<CheckOutlined />} />
          <Button size="small" title="不通过" onClick={e => setReject(-1)} icon={<CloseOutlined />} />
          <Button size="small" type="text" style={{ marginLeft: 8 }}>
            编辑
          </Button>
          {licenseTypeOptions.map(o => (
            <Button size="small" title={`设置${o.label}`} onClick={e => setLicenseTypeList(-1, o.value)}>
              {o.label}
            </Button>
          ))}

          {qualityOptions.map(o => (
            <Button size="small" title={`设置等级${o.label}`} key={o.value} onClick={e => setQualityList(-1, o.value)}>
              {o.label}
            </Button>
          ))}
          <Button
            size="small"
            title="设置授权文件说明"
            onClick={e => setCopyrightList(-1)}
            icon={<Iconfont type="icon-shouquanweituoshu" />}
          />
          <Button size="small" title="修改备注" onClick={e => setMemoList(-1)} icon={<Iconfont type="icon-beizhu" />} />
          <Button
            size="small"
            title="批量打开大图"
            onClick={e => openOriginImage(-1)}
            icon={<Iconfont type="icon-tu" />}
          />
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
            onChange={(field, value) => {
              setList([item.id], { [field]: value });
            }}
          />
        )}
      />
    </>
  );
}

export default List;
