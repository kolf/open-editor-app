import React, { useState, useEffect, useContext } from 'react';
import { useRequest } from 'ahooks';
import { FetchResult } from '@ahooksjs/use-request/lib/types';
import { Radio, Button, Space, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Iconfont from 'src/components/Iconfont';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from 'src/components/formlist/FormList';
import ListItem from './ListItem';
import SelectReject from 'src/components/modals/SelectReject';
import { DataContext } from 'src/components/contexts/DataProvider';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useHeaderSearch } from 'src/hooks/useHeaderSearch';
import useImage from 'src/hooks/useImage';
import imageService from 'src/services/imageService';

import options, { Quality, LicenseType, CopyrightType } from 'src/declarations/enums/query';

import config from 'src/config';
import confirm from 'src/utils/confirm';

const qualityOptions = options.get(Quality);
const licenseTypeOptions = options.get(LicenseType);
const copyrightOptions = options.get(CopyrightType);

const initialData = {
  list: [],
  total: 0
};

export default React.memo(function List() {
  useDocumentTitle(`我的审核-VCG内容审核管理平台`);
  const { partyId } = useCurrentUser();
  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60, qualityStatus: '14' });
  const { run: review } = useRequest(imageService.qualityReview, { manual: true, throwOnError: true });
  const { run: update } = useRequest(imageService.update, { manual: true, throwOnError: true });

  const {
    data: { list, total } = initialData,
    loading = true,
    mutate,
    run
  }: FetchResult<IImageResponse, any> = useRequest(
    async () => {
      const res = await imageService.getList(formatQuery(query));
      return res;
    },
    {
      ready: !!(providerOptions && categoryOptions && allReason),
      throttleInterval: 600,
      formatResult: data => formatResult(data),
      refreshDeps: [query]
    }
  );

  const [keywords] = useHeaderSearch(() => onRefresh());

  const {
    getReasonTitle,
    showDetails,
    showLogs,
    showMiddleImage,
    openLicense,
    openOriginImage,
    selectedIds,
    onSelect,
    setList,
    setSelectedIds
  } = useImage({
    list,
    onChange: list => {
      mutate({
        total,
        list
      });
    }
  });

  useEffect(() => {
    setSelectedIds([]);
  }, [query]);
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
            memo,
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
            tempData: {
              memo
            },
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

  // TODO 待优化
  const handleChange = <K extends keyof IImage>(index: number, field: K, value: any) => {
    const { id } = list[index];
    setList([{ id, [field]: value }]);
  };

  // 点击某一项数据
  const handleClick = (index: number, field: IImageActionType) => {
    switch (field) {
      case 'id':
        showDetails(index);
        break;
      case 'cover':
        onSelect(index);
        break;
      case 'middleImage':
        showMiddleImage(index);
        break;
      case 'originImage':
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
      case 'releases':
        openLicense(index);
        break;
      default:
        break;
    }
  };

  // 设置通过
  const setResolve = async (index: number) => {
    const idList = index === -1 ? selectedIds : [list[index].id];

    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    let mod = null;
    try {
      mod = await confirm({ title: '图片通过', content: `请确认当前选中图片全部设置为通过吗?` });

      const imageList = list
        .filter(item => idList.includes(item.id) && item.osiImageReview.callbackStatus !== 2)
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
      setList(
        idList.map(id => {
          const item = list.find(l => l.id === id);
          return {
            id,
            reasonTitle: '',
            osiImageReview: {
              ...item.osiImageReview,
              qualityStatus: '24' as IOsiImageReview['qualityStatus']
            }
          };
        })
      );
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置不通过
  const setReject = async (index: number) => {
    const idList = index === -1 ? selectedIds : [list[index].id];

    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    let mod = null;
    let standardReason = [];
    let customReason = '';

    try {
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
        .filter(item => idList.includes(item.id) && item.osiImageReview.callbackStatus !== 2)
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
      const res = await review({
        body: imageList,
        query: { stage: 1, status: 2, standardReason: standardReason.join(','), customReason }
      });
      mod.close();
      message.success(`设置不通过成功！`);

      const reasonTitle = getReasonTitle(standardReason, customReason);

      setList(
        idList.map(id => {
          const item = list.find(l => l.id === id);
          return {
            id,
            reasonTitle,
            osiImageReview: {
              ...item.osiImageReview,
              qualityStatus: '34' as IOsiImageReview['qualityStatus']
            }
          };
        })
      );
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置等级
  const setQualityList = async (index: number, value: IImage['qualityRank']) => {
    const idList = index === -1 ? selectedIds : [list[index].id];

    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    let mod = null;
    try {
      mod = await confirm({ title: '设置等级', content: `请确认当前选中图片设置为当前选中的质量等级吗?` });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '1', value } });
      mod.close();
      message.success(`设置等级成功！`);
      setList(
        idList.map(id => ({
          id,
          qualityRank: value
        }))
      );
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置授权类型
  const setLicenseTypeList = async (index: number, value: IImage['licenseType']) => {
    const idList = index === -1 ? selectedIds : [list[index].id];

    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    let mod = null;
    try {
      mod = await confirm({ title: '设置授权', content: `请确认当前选中图片设置为当前选中授权RF/RM吗?` });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '2', value } });
      mod.close();
      message.success(`设置授权成功！`);

      setList(
        idList.map(id => ({
          id,
          licenseType: value
        }))
      );
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  // 设置授权
  const setCopyrightList = async (index: number) => {
    const idList = index === -1 ? selectedIds : [list[index].id];

    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    let mod = null;
    try {
      let value: IImage['copyright'] = null;

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

      setList(
        idList.map(id => ({
          id,
          copyright: value
        }))
      );
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  const setMemoList = async (index: number) => {
    const idList = index === -1 ? selectedIds : [list[index].id];

    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    let mod = null;
    try {
      let value: IImage['memo'] = '';

      mod = await confirm({
        title: '设置备注',
        content: <Input placeholder="请输入备注信息" onChange={e => (value = e.target.value)} />
      });

      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '4', memo: value } });
      mod.close();
      message.success(`设置授权成功！`);

      setList(
        idList.map(id => ({
          id,
          memo: value
        }))
      );
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  return (
    <>
      <FormList
        itemKeys={[
          3,
          1,
          2,
          4,
          { key: 5, options: providerOptions },
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          { key: 13, options: categoryOptions }
        ]}
        initialValues={query}
        onChange={value => setQuery({ ...query, ...value, pageNum: 1 })}
      />
      <Toolbar
        onSelectIds={setSelectedIds}
        onRefresh={onRefresh}
        selectedIds={selectedIds}
        idList={list.map(item => item.id)}
        pagerProps={{
          total,
          current: query.pageNum,
          pageSize: query.pageSize,
          onChange: value => {
            setQuery({ ...query, ...value });
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
            <Button
              size="small"
              title={`设置${o.label}`}
              onClick={e => setLicenseTypeList(-1, o.value as IImage['licenseType'])}
            >
              {o.label}
            </Button>
          ))}

          {qualityOptions.map(o => (
            <Button
              size="small"
              title={`设置等级${o.label}`}
              key={o.value}
              onClick={e => setQualityList(-1, o.value as IImage['qualityRank'])}
            >
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
      <GridList<IImage>
        loading={loading}
        dataSource={list}
        renderItem={(item, index) => (
          <ListItem
            selected={selectedIds.includes(item.id)}
            dataSource={item}
            index={index}
            onClick={handleClick}
            onChange={handleChange}
          />
        )}
      />
    </>
  );
});
