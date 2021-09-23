import React, { useState, useEffect, useContext } from 'react';
import { useRequest } from 'ahooks';
import { FetchResult } from '@ahooksjs/use-request/lib/types';
import moment from 'moment';
import { Radio, Button, Space, Input, message } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  LineOutlined,
  FileSearchOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import GridList from 'src/components/list/GridList';
import Toolbar from 'src/components/list/Toolbar';
import FormList from './FormList';
import ListItem from './ListItem';
import SelectReject from 'src/components/modals/SelectReject';
import { DataContext } from 'src/components/contexts/DataProvider';
import { ModeType as KeywordModeType } from 'src/components/KeywordTextAreaGroup';
import { useDocumentTitle } from 'src/hooks/useDom';
import { useCurrentUser } from 'src/hooks/useCurrentUser';
import { useSearchValue } from 'src/hooks/useSearchValue';
import useImage from 'src/hooks/useImage';
import imageService from 'src/services/imageService';

import config from 'src/config';
import confirm from 'src/utils/confirm';
import { getReasonTitle, getReasonMap } from 'src/utils/getReasonTitle';

const initialData = {
  list: [],
  total: 0
};

export default React.memo(function List() {
  useDocumentTitle(`我的审核-VCG内容审核管理平台`);
  const { partyId } = useCurrentUser();
  const [keywords] = useSearchValue();
  const { providerOptions, categoryOptions, allReason } = useContext(DataContext);
  const reasonMap = getReasonMap(allReason);
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60, keywordsStatus: '14' });
  const [keywordMode, setKeywordMode] = useState<KeywordModeType>('all');
  const { run: review } = useRequest(imageService.qualityReview, { manual: true, throwOnError: true });

  const {
    data: { list, total } = initialData,
    loading = true,
    mutate,
    refresh
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
      refreshDeps: [query, keywords]
    }
  );

  const {
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
    if (selectedIds.length > 0) {
      setSelectedIds([]);
    }
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
          const { osiImageReview, osiProviderId, category, standardReason, customReason } = item;
          const categoryList: IImage['categoryNames'][] = (category || '')
            .split(',')
            .filter((item, index) => item && index < 2);
          let reasonTitle: IImage['reasonTitle'] = '';

          if (/^3/.test(osiImageReview.keywordsStatus) && (standardReason || customReason)) {
            reasonTitle = getReasonTitle(reasonMap, standardReason, customReason);
          }

          return {
            ...item,
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

  // TODO
  const handleChange = <K extends keyof IImage>(index: number, field: K, value: any) => {
    const { id } = list[index];
    setList([id], { [field]: value });
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
        idList,
        idList.map(id => {
          const item = list.find(l => l.id === id);
          return {
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

      const reasonTitle = getReasonTitle(reasonMap, standardReason, customReason);

      setList(
        idList,
        idList.map(id => {
          const item = list.find(l => l.id === id);
          return {
            reasonTitle,
            osiImageReview: {
              ...item.osiImageReview,
              keywordsStatus: '34' as IOsiImageReview['keywordsStatus']
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
        onRefresh={refresh}
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
          <Button size="small" title="不通过" onClick={e => setReject(-1)} icon={<CloseOutlined />} />
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
