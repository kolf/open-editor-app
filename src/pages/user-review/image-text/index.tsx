import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useRequest } from 'ahooks';
import { FetchResult } from '@ahooksjs/use-request/lib/types';
import { Radio, Button, Space, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Iconfont from 'src/components/Iconfont';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from 'src/components/FormList';
import ListItem from './ListItem';
import SelectReject from 'src/components/modals/SelectReject';
import { DataContext } from 'src/components/contexts/DataProvider';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useHeaderSearch } from 'src/hooks/useHeaderSearch';
import useImage from 'src/hooks/useImage';
import imageService from 'src/services/imageService';

import options, { Quality, LicenseType, AuditType } from 'src/declarations/enums/query';

import config from 'src/config';
import confirm from 'src/utils/confirm';
import { useOptions } from 'src/hooks/useSelect';
import { IFormItemKey } from 'src/hooks/useFormItems';
import { usePermissions } from 'src/hooks/usePermissions';

const qualityOptions = options.get(Quality);
const licenseTypeOptions = options.get(LicenseType);

const initialData = {
  list: [],
  total: 0
};

export default React.memo(function List() {
  const { formatMessage } = useIntl();
  useDocumentTitle(`我的审核-VCG内容审核管理平台`);
  const { id } = useCurrentUser();
  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60, qualityStatus: '14' });
  const { run: review } = useRequest(imageService.qualityReview, { manual: true, throwOnError: true });
  const { run: update } = useRequest(imageService.update, { manual: true, throwOnError: true });
  const copyrightOptions = useOptions('image.copyright', ['0', '1', '2', '3', '7', '9']);
  
  const { dataSourceOptions, imageTypeOptions } = usePermissions(AuditType.质量审核);

  const {
    data: { list, total } = initialData,
    loading = true,
    mutate
  }: FetchResult<IImageResponse, any> = useRequest(
    async () => {
      const res = await imageService.getList(formatQuery(query));
      let nextList = res.list.map(item => {
        const providerObj = providerOptions.find(o => o.value === item.osiProviderId + '');
        if (providerObj) {
          return {
            ...item,
            keywordsReviewKeywords: providerObj.keywordsReviewKeywords,
            keywordsReivewTitle: providerObj.keywordsReivewTitle,
            osiProviderName: providerObj.label
          };
        }
        return item;
      });
      nextList = await imageService.joinTitle(nextList);

      return {
        total: res.total,
        list: nextList
      };
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

  console.log(imageTypeOptions, typeof imageTypeOptions)
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
        qualityAuditorId: id
      }
    );

    if (!query.qualityStatus) {
      result['qualityStatus'] = '14,24,34';
    }

    if (keywords) {
      result['keyword'] = keywords;
      result['searchType'] = /^[\d,]*$/.test(keywords) ? '2' : '1';
    }

    if (!query.imageType) {
      result['imageType'] = imageTypeOptions.join(',')
    }
    if (!query.osiProviderId) {
      result['osiProviderId'] = dataSourceOptions?.map(o => o.value).join(',')
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
            categoryNames: categoryOptions
              .filter(o => categoryList.includes(o.value + ''))
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
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }

    let mod = null;
    try {
      mod = await confirm({
        title: formatMessage({ id: 'image.action.setResolve' }),
        content: formatMessage({ id: 'image.action.setResolve.content' })
      });

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
      message.success(formatMessage({ id: 'message.setting.success' }));
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
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }

    let mod = null;
    let standardReason = [];
    let customReason = '';

    try {
      mod = await confirm({
        width: 820,
        title: formatMessage({ id: 'image.action.setReject' }),
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
        message.info(formatMessage({ id: 'select.placeholder' }));
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
      message.success(formatMessage({ id: 'message.setting.success' }));

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
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }

    let mod = null;
    try {
      mod = await confirm({
        title: formatMessage({ id: 'image.action.setQualityRank' }),
        content: formatMessage({ id: 'image.action.setQualityRank.content' })
      });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '1', value } });
      mod.close();
      message.success(formatMessage({ id: 'message.setting.success' }));
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
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }

    let mod = null;
    try {
      mod = await confirm({
        title: formatMessage({ id: 'image.action.setLicenseType' }),
        content: formatMessage({ id: 'image.action.setLicenseType.content' })
      });
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '2', value } });
      mod.close();
      message.success(formatMessage({ id: 'message.setting.success' }));

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
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }

    let mod = null;
    try {
      let value: IImage['copyright'] = null;

      mod = await confirm({
        title: formatMessage({ id: 'image.action.setCopyright' }),
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
        message.info(formatMessage({ id: 'select.placeholder' }));
        return;
      }
      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '3', value: value } });
      mod.close();
      message.success(formatMessage({ id: 'message.setting.success' }));

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
      message.info(formatMessage({ id: 'image.error.unselect' }));
      return;
    }

    let mod = null;
    try {
      let value: IImage['memo'] = '';

      mod = await confirm({
        title: formatMessage({ id: 'image.action.setMemo' }),
        content: (
          <Input placeholder={formatMessage({ id: 'input.placeholder' })} onChange={e => (value = e.target.value)} />
        )
      });

      mod.confirmLoading();
      const res = await update({ body: idList, query: { type: '4', memo: value } });
      mod.close();
      message.success(formatMessage({ id: 'message.setting.success' }));

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

  const formItemKeys: IFormItemKey[] = React.useMemo(() => {
    return [
      1,
      2,
      4,
      { key: 5, options: dataSourceOptions },
      6,
      {
        key: 15,
        options: imageTypeOptions
      },
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
      <FormList
        itemKeys={formItemKeys}
        initialValues={query}
        onChange={values => setQuery({ ...query, ...values, pageNum: 1 })}
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
          onChange: values => {
            setQuery({ ...query, ...values });
          }
        }}
      >
        <Space>
          <Button size="small" type="text" style={{ marginLeft: 8 }}>
            <FormattedMessage id="image.review" />
          </Button>
          <Button
            size="small"
            title={formatMessage({ id: 'image.action.setResolve' })}
            onClick={e => setResolve(-1)}
            icon={<CheckOutlined />}
          />
          <Button
            size="small"
            title={formatMessage({ id: 'image.action.setReject' })}
            onClick={e => setReject(-1)}
            icon={<CloseOutlined />}
          />
          <Button size="small" type="text" style={{ marginLeft: 8 }}>
            <FormattedMessage id="image.update" />
          </Button>
          {licenseTypeOptions.map(o => (
            <Button
              size="small"
              title={formatMessage({ id: 'image.action.setLicenseType' })}
              onClick={e => setLicenseTypeList(-1, o.value as IImage['licenseType'])}
            >
              {o.label}
            </Button>
          ))}

          {qualityOptions.map(o => (
            <Button
              size="small"
              title={formatMessage(
                { id: 'image.setting' },
                { value: formatMessage({ id: 'image.qualityRank' }) + ' ' + o.label }
              )}
              key={o.value}
              onClick={e => setQualityList(-1, o.value as IImage['qualityRank'])}
            >
              {o.label}
            </Button>
          ))}
          <Button
            size="small"
            title={formatMessage({ id: 'image.action.setCopyright' })}
            onClick={e => setCopyrightList(-1)}
            icon={<Iconfont type="icon-shouquanweituoshu" />}
          />
          <Button
            size="small"
            title={formatMessage({ id: 'image.action.setMemo' })}
            onClick={e => setMemoList(-1)}
            icon={<Iconfont type="icon-beizhu" />}
          />
          <Button
            size="small"
            title={formatMessage({ id: 'image.action.openOriginImage' })}
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
