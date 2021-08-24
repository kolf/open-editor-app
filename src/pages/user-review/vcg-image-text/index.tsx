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
import ImageDetails from 'src/components/modals/ImageDetails';
import SelectReject from 'src/components/modals/SelectReject';
import ImageLogs from 'src/components/modals/ImageLogs';
import Loading from 'src/components/common/LoadingBlock';
import { DataContext } from 'src/components/contexts/DataProvider';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useKeywords } from 'src/hooks/useKeywords';
import imageService from 'src/services/imageService';

import options, { Quality, LicenseType, CopyrightType } from 'src/declarations/enums/query';

import config from 'src/config';
import modal from 'src/utils/modal';
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
  const { run: getExif } = useRequest(imageService.getExif, { manual: true, throwOnError: true });
  const {
    data: { list, total },
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
      initialData,
      formatResult
    }
  );

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
          const { qualityStatus, priority, callbackStatus } = osiImageReview;
          const categoryList = (category || '').split(',');
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
            callbackStatus,
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

  // 改变数据某一项的值
  const handleForceChange = (index, field, value) => {
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
      case 'memo':
        setMemo(index, value);
        break;
      default:
        alert(field);
        break;
    }
  };

  const setList = (ids, props) => {
    const nextList = list.map(item => {
      if (ids.includes(item.id)) {
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
    const idList = index === -1 ? checkSelectedIds() : [list[index].id];
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

  // 显示操作日志
  const showLogs = async index => {
    const { id } = list[index];
    const res = await imageService.getLogList([id]);

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
      setSelectedIds([]);
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
      setSelectedIds([]);
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
      setList(idList, {
        qualityRank: value
      });
      setSelectedIds([]);
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
      setList(idList, {
        licenseType: value
      });
      setSelectedIds([]);
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // const
  // 设置授权
  const setCopyright = async (index, value) => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({ title: '设置授权', content: `请确认当前选中图片设置为当前选中授权吗?` });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '3', value } });
      mod.close();
      message.success(`设置授权成功！`);
      setList(idList, {
        copyright: value
      });
      setSelectedIds([]);
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  const setCopyrightList = async index => {
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      let copyright = '';
      mod = await confirm({
        title: '设置授权',
        content: (
          <Radio.Group
            onChange={e => {
              copyright = e.target.value;
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
      if (!copyright) {
        message.info(`请选择授权！`);
        return;
      }
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '3', value: copyright } });
      mod.close();
      message.success(`设置授权成功！`);
      setList(idList, {
        copyright
      });
      setSelectedIds([]);
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置备注
  const setMemo = async (index, value) => {
    const { id } = list[index];
    const idList = [id];
    let mod = null;
    try {
      mod = await confirm({ title: '设置备注', content: `请确认是否修改备注?` });
    } catch (error) {
      mutate({
        total,
        list: list.map(item => {
          if (idList.includes(item.id)) {
            const { tempData } = item;
            return {
              ...item,
              ...tempData
            };
          }
          return item;
        })
      });
      return;
    }
    try {
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '4', memo: value } });
      mod.close();
      message.success(`设置备注成功！`);
      setList(idList, {
        memo: value
      });
      setSelectedIds([]);
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  const setMemoList = async (index, value) => {
    // setMemo
    let mod = null;
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      let memo = value || '';
      mod = await confirm({
        title: '设置备注',
        content: <Input placeholder="请输入备注信息" onChange={e => (memo = e.target.value)} />
      });
      if (!memo) {
        message.info(`请输入备注信息！`);
        return;
      }
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '4', memo } });
      mod.close();
      message.success(`设置授权成功！`);
      setList(idList, {
        memo
      });
      setSelectedIds([]);
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
        onRefresh={refresh}
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
            <Button size="small" title={`设置${o.label}`} onClick={e => setLicenseType(-1, o.value)}>
              {o.label}
            </Button>
          ))}

          {qualityOptions.map(o => (
            <Button size="small" title={`设置等级${o.label}`} key={o.value} onClick={e => setQuality(-1, o.value)}>
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
            onForceChange={(field, value) => handleForceChange(index, field, value)}
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
