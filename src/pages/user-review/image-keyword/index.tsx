import React, { useState, useEffect, useContext } from 'react';
import { useRequest } from 'ahooks';
import { FetchResult } from '@ahooksjs/use-request/lib/types';
import { Radio, Button, Space, Input, message } from 'antd';
import { CheckOutlined, LineOutlined, FileSearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import { DataContext } from 'src/components/contexts/DataProvider';
import { ModeType as KeywordModeType } from 'src/components/KeywordTextAreaGroup';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useHeaderSearch } from 'src/hooks/useHeaderSearch';
import useImage from 'src/hooks/useImage';
import imageService from 'src/services/imageService';

import config from 'src/config';
import confirm from 'src/utils/confirm';

const initialData = {
  list: [],
  total: 0
};

export default React.memo(function List() {
  useDocumentTitle(`我的审核-VCG内容审核管理平台`);
  const { partyId } = useCurrentUser();

  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60, keywordsStatus: '14' });
  const [keywordMode, setKeywordMode] = useState<KeywordModeType>('all');
  const { run: review } = useRequest(imageService.keywordsReview, { manual: true, throwOnError: true });

  const {
    data: { list, total } = initialData,
    loading = true,
    mutate,
    run
  }: FetchResult<IImageResponse, any> = useRequest(
    async () => {
      const res = await imageService.getList(formatQuery(query));
      let nextList = await imageService.getKeywordTags(res.list);

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

    if (!query.keywordsStatus) {
      result['keywordsStatus'] = '14,24,34';
    }

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
    setSelectedIds([]);
    run();
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
    const idList = index === -1 ? selectedIds : [list[index].id];

    if (idList.length === 0) {
      message.info(`请选择图片！`);
      return;
    }

    let mod = null;
    try {
      mod = await confirm({ title: '图片通过', content: `请确认当前选中图片全部设置为通过吗?` });

      const imageList = list
        // .filter(item => idList.includes(item.id) && item.osiImageReview.callbackStatus !== 2)
        .map(item => {
          console.log(keywordTags2string(item.keywordTags));
          return {
            ...item,
            keywordTags: undefined,
            osiImageReview: undefined,
            createdTime: undefined,
            updatedTime: undefined
          };
        });
      if (imageList.length === 0) {
        mod.close();
        return;
      }
      mod.confirmLoading();
      const res = await review({ body: imageList, query: { status: 1 } });
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
              keywordsStatus: '24' as IOsiImageReview['keywordsStatus']
            }
          };
        })
      );
    } catch (error) {
      mod && mod.close();
      error && message.error(error);
    }
  };

  return (
    <>
      <FormList onChange={value => setQuery({ ...query, ...value, pageNum: 1 })} initialValues={query} />
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
              <LineOutlined title="展示全部" />
            </Radio.Button>
            <Radio.Button value="source">
              <FileSearchOutlined title="按来源展示" />
            </Radio.Button>
            <Radio.Button value="kind">
              <UnorderedListOutlined title="按类型展示" />
            </Radio.Button>
          </Radio.Group>
        }
      >
        <Space>
          <Button size="small" type="text" style={{ marginLeft: 8 }}>
            审核
          </Button>
          <Button size="small" title="通过" onClick={e => setResolve(-1)} icon={<CheckOutlined />} />
          <Button size="small" type="text" style={{ marginLeft: 8 }}>
            编辑
          </Button>
          <Button size="small" title="修改标题" onClick={e => updateTitle(selectedIds)}>
            标题
          </Button>
          <Button size="small" title="修改关键词" onClick={e => updateKeywords(selectedIds)}>
            关键词
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
