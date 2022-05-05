import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useRequest } from 'ahooks';
import { FetchResult } from '@ahooksjs/use-request/lib/types';
import { Radio, Button, Space, Input, message } from 'antd';
import { CheckOutlined, LineOutlined, FileSearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from 'src/components/FormList';
import ListItem from './ListItem';
import { DataContext } from 'src/components/contexts/DataProvider';
import { ModeType as KeywordModeType } from 'src/components/KeywordTextAreaGroup';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useHeaderSearch } from 'src/hooks/useHeaderSearch';
import useImage from 'src/hooks/useImage';
import { IFormItemKey } from 'src/hooks/useFormItems';
import imageService from 'src/services/imageService';

import config from 'src/config';
import confirm from 'src/utils/confirm';
import modal from 'src/utils/modal';
import { usePermissions } from 'src/hooks/usePermissions';
import { AuditType } from 'src/declarations/enums/query';

const initialData = {
  list: [],
  total: 0
};

export default React.memo(function List() {
  const { formatMessage } = useIntl();
  useDocumentTitle(`我的审核-VCG内容审核管理平台`);
  const { partyId } = useCurrentUser();

  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60, keywordsStatus: '14' });
  const [keywordMode, setKeywordMode] = useState<KeywordModeType>('all');
  const { run: review } = useRequest(imageService.keywordsReview, { manual: true, throwOnError: true });

  const { dataSourceOptions, imageTypeOptions } = usePermissions(AuditType.关键词审核);

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
            keywordsReivewTitle: providerObj.keywordsReivewTitle
          };
        }
        return item;
      });
      console.log(nextList,'list')
      nextList = await imageService.getKeywordTags(nextList);
      nextList = await imageService.checkAmbiguityKeywords(nextList);

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
    showSensitiveWowrds,
    getReasonTitle,
    keywordTags2string,
    showDetails,
    showLogs,
    showMiddleImage,
    openLicense,
    openOriginImage,
    updateTitle,
    updateKeywords,
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
        keywordsAuditorId: partyId
      }
    );

    if (!query.keywordsStatus) {
      result['keywordsStatus'] = '14,15,24,34';
    }

    if (keywords) {
      result['keyword'] = keywords;
      result['searchType'] = /^[\d,]*$/.test(keywords) ? '2' : '1';
    }

    if (!query.imageType) {
      result['imageType'] = imageTypeOptions.join(',');
    }
    if (!query.osiProviderId) {
      result['osiProviderId'] = dataSourceOptions?.map(o => o.value).join(',');
    }

    return result;
  };

  // 格式化返回的数据
  const formatResult = (data: IImageResponse): IImageResponse => {
    try {
      return {
        total: data.total,
        list: data.list.map(item => {
          const { osiImageReview, osiProviderId, category, standardReason, customReason, keywordTags } = item;
          const categoryList: IImage['categoryNames'][] = (category || '')
            .split(',')
            .filter((item, index) => item && index < 2);
          let reasonTitle: IImage['reasonTitle'] = '';

          if (/^3/.test(osiImageReview.keywordsStatus) && (standardReason || customReason)) {
            reasonTitle = getReasonTitle(standardReason, customReason);
          }

          return {
            ...item,
            reasonTitle,
            keywordTags: keywordTags || [],
            osiProviderName: providerOptions.find(o => o.value === osiProviderId + '').label,
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

  // TODO
  const handleChange = async <K extends keyof IImage>(index: number, field: K, value: any) => {
    const { id } = list[index];
    let nextList: IImage[] = [{ id, [field]: value }];
    if (field === 'keywordTags') {
      nextList = await imageService.checkAmbiguityKeywords(nextList);
    }

    setList(nextList);
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
    const idList: IdList = index === -1 ? selectedIds : [list[index].id];

    let mod = null;
    try {
      const submitList = await validatorList(idList);

      mod = await confirm({
        title: formatMessage({ id: 'image.action.setResolve' }),
        content: formatMessage({ id: 'image.action.setResolve.content' })
      });

      mod.confirmLoading();

      const res = await review({ body: submitList, query: { status: 1 } });
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
              keywordsStatus: '24' as IOsiImageReview['keywordsStatus']
            }
          };
        })
      );
    } catch (error) {
      mod && mod.close();
      error?.message && message.error(error.message);
    }

    async function validatorList(idList: IdList) {
      // 没有选中图片
      if (idList.length === 0) {
        throw new Error(formatMessage({ id: 'image.error.unselect' }));
      }

      let submitList = list.filter(
        item => idList.includes(item.id) && item.osiImageReview.keywordsCallbackStatus !== 2
      );
      // 没有可以提交的数据
      if (submitList.length === 0) {
        throw new Error(formatMessage({ id: 'image.error.nosubmit' }));
      }

      // 标题为空
      if (submitList.some(item => !item.title)) {
        const mod = modal({
          title: formatMessage({ id: 'modal.title' }),
          content: (
            <div>
              <FormattedMessage id="image.error.unTitle" /> ID：
              {submitList
                .filter(item => !item.title)
                .map(item => (
                  <span key={item.id + ''} className="text-error">
                    {item.id}，
                  </span>
                ))}
            </div>
          ),
          footer: null
        });
        throw new Error('');
      }

      submitList = submitList.map(item => {
        const { keywords, keywordsAudit, keywordsAll } = keywordTags2string(item.keywordTags);
        return {
          ...item,
          keywords,
          osiKeywodsData: {
            ...item.osiKeywodsData,
            keywordsAudit,
            keywordsAll
          },
          keywordTags: undefined,
          osiImageReview: undefined,
          createdTime: undefined,
          updatedTime: undefined
        };
      });
      // 关键词小于5个 大于45个
      if (
        submitList.some(item => {
          const keywordIdList = item.keywords?.match(/\d+/g) || [];
          return keywordIdList.length < 5 || keywordIdList.length > 45;
        })
      ) {
        const mod = modal({
          title: formatMessage({ id: 'modal.title' }),
          content: (
            <div>
              <FormattedMessage id="image.error.keywordLetFive" /> ID：
              {submitList
                .filter(item => {
                  const keywordIdList = item.keywords?.match(/\d+/g) || [];
                  return keywordIdList.length < 5 || keywordIdList.length > 45;
                })
                .map(item => (
                  <span key={item.id + ''} className="text-error">
                    {item.id}，
                  </span>
                ))}
            </div>
          ),
          footer: null
        });
        throw new Error('');
      }

      // 含有敏感词
      const sensitiveWordsList = await imageService.checkSensitiveWords(submitList);
      if (sensitiveWordsList.length) {
        try {
          await showSensitiveWowrds(sensitiveWordsList);
        } catch (error) {
          throw new Error('');
        }
      }

      return submitList;
    }
  };

  const formItemKeys: IFormItemKey[] = React.useMemo(() => {
    return [
      1,
      2,
      14,
      {
        key: 5,
        options: dataSourceOptions
      },
      {
        key: 15,
        options: imageTypeOptions
      },
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
      <FormList
        itemKeys={formItemKeys}
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
        extraContent={
          <Radio.Group
            size="small"
            defaultValue="all"
            onChange={e => {
              setKeywordMode(e.target.value);
            }}
          >
            <Radio.Button value="all">
              <LineOutlined title={formatMessage({ id: 'keywords.mode.all' })} />
            </Radio.Button>
            <Radio.Button value="source">
              <FileSearchOutlined
                title={formatMessage({
                  id: 'keywords.mode.source'
                })}
              />
            </Radio.Button>
            <Radio.Button value="kind">
              <UnorderedListOutlined title={formatMessage({ id: 'keywords.mode.kind' })} />
            </Radio.Button>
          </Radio.Group>
        }
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
          <Button size="small" type="text" style={{ marginLeft: 8 }}>
            <FormattedMessage id="image.update" />
          </Button>
          <Button
            size="small"
            title={formatMessage({ id: 'image.setting' }, { value: formatMessage({ id: 'image.title' }) })}
            onClick={e => updateTitle(selectedIds)}
          >
            <FormattedMessage id="image.title" />
          </Button>
          <Button
            size="small"
            title={formatMessage({ id: 'image.setting' }, { value: formatMessage({ id: 'image.keywords' }) })}
            onClick={e => updateKeywords(selectedIds)}
          >
            <FormattedMessage id="image.keywords" />
          </Button>
        </Space>
      </Toolbar>
      <GridList<IImage>
        loading={loading}
        dataSource={list}
        renderItem={(item, index) => (
          <ListItem
            selected={selectedIds.includes(item.id)}
            keywordMode={keywordMode}
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
