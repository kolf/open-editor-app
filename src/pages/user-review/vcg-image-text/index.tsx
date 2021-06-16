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
import Loading from 'src/components/common/LoadingBlock';
import imageService from 'src/services/imageService';
import options, { Quality, LicenseType, CopyrightType } from 'src/declarations/enums/query';
import config from 'src/config';
import modal from 'src/utils/modal';
import confirm from 'src/utils/confirm';
const qualityOptions = options.get(Quality);
const licenseTypeOptions = options.get(LicenseType);
const copyrightTypeOptions = options.get(CopyrightType);

interface listProps {
  // TODO: 添加图片接口
  list?: any;
  total?: number;
}

function List() {
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const [selectedIds, setSelectedIds] = useState([]);
  const { run: review } = useRequest(imageService.qualityReview, { manual: true });
  const { run: update } = useRequest(imageService.update, { manual: true });
  const { run: showExifDetails } = useRequest(imageService.getExif, { manual: true });
  const { data, loading, error, run, refresh } = useRequest(imageService.getList, {
    manual: true,
    initialData: {
      list: [],
      total: 0
    }
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
      if (/Time$/g.test(key)) {
        result[key] = value.format(config.data.DATE_FORMAT);
      } else if (typeof value === 'object') {
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
    return {
      total: data.total,
      list: data.list.map(item => {
        const { createdTime, updatedTime, qualityRank, copyright, licenseType } = item;
        return {
          ...item,
          copyright: copyright + '',
          qualityRank: qualityRank ? qualityRank + '' : undefined,
          licenseType: licenseType + '' || undefined,
          createdTime: moment(createdTime).format(config.data.SECOND_MINUTE),
          updatedTime: moment(updatedTime).format(config.data.SECOND_MINUTE)
        };
      })
    };
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
      case 'resolve':
        setResolve(index);
        break;
      case 'reject':
        setReject(index);
        break;
      default:
        alert(field);
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
      // return Promise.reject(`请选择图片！`);
      throw '请选择图片！';
    }
    return [...selectedIds];
  };

  const showDetails = async index => {
    const { id, urlSmall } = list[index];
    const mod = modal({
      title: `图片详情`,
      width: 640,
      content: <Loading />,
      footer: null
    });
    try {
      const res = await showExifDetails({ id });
      mod.update({
        content: <ImageDetails dataSource={{ ...res, imgUrl: urlSmall }} />
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
    let standardReason = '';
    try {
      const idList = index === -1 ? checkSelectedIds() : [list[index].id];
      mod = await confirm({
        title: '设置不通过原因',
        content: (
          <Radio.Group onChange={e => (standardReason = e.target.value)}>
            <Space direction="vertical">
              <Radio value={1}>Option A</Radio>
              <Radio value={2}>Option B</Radio>
              <Radio value={3}>Option C</Radio>
            </Space>
          </Radio.Group>
        )
      });

      if (!standardReason) {
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
        query: { stage: 1, status: 2, standardReason }
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

      // TODO：更换设置等级接口
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
      // TODO：更换设置等级接口
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
      // TODO：更换设置等级接口
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
        dataTotal={total}
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
