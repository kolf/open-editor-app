import useRequest from '@ahooksjs/use-request';
import { Button, message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import options, {
  AIService,
  AssetType,
  AssignType,
  AuditType,
  OsiDbProviderStatus,
  SensitiveCheckType
} from 'src/declarations/enums/query';
import providerService from 'src/services/providerService';
import modal from 'src/utils/modal';
import CreateDataModal from './DataSourceForm';

enum ModalType {
  创建数据来源,
  修改数据来源
}

function List() {
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const {
    data = { list: [], total: 0 },
    loading,
    run: fetchData
  } = useRequest(providerService.getList, { manual: true });
  const { list, total } = data;

  useEffect(() => {
    fetchData(query);
  }, [query]);

  // 发送请求前的数据处理
  function makeRequestPayLoad(payload) {
    const result = Object.keys(payload).reduce((memo, p) => {
      const v = payload[p] || [];
      switch (p) {
        case 'AIDetection':
          if (v.includes(AIService.AI质量评分)) memo['ifAiQualityScore'] = '1';
          if (v.includes(AIService.AI美学评分)) memo['ifAiBeautyScore'] = '1';
          if (v.includes(AIService.AI分类)) memo['ifAiCategory'] = '1';
          if (v.includes(AIService['AI自动标题/关键词'])) memo['ifAiKeywords'] = '1';
          Reflect.deleteProperty(payload, p);
          break;
        case 'auditFlows':
        case 'sensitiveCheckType':
        case 'keywordsReivewTitle':
        case 'keywordsReviewKeywords':
        case 'sensitiveKeywordsTable':
          memo[p] = v.join(',');
          break;
        default:
          memo[p] = payload[p];
      }
      return memo;
    }, {});
    return result;
  }

  // 接受请求后的数据处理
  const makeResponsePayload = initialValues => {
    const value = Object.keys(initialValues).reduce((memo, key) => {
      const v = initialValues[key];
      switch (key) {
        // 多选将1,2,3处理成['1','2','3']交由组件渲染
        case 'auditFlows':
        case 'sensitiveCheckType':
        case 'sensitiveKeywordsTable':
        case 'keywordsReivewTitle':
        case 'keywordsReviewKeywords':
          memo[key] = v.split(',');
          break;
        // AI服务因字段原因单独处理
        case 'ifAiQualityScore':
        case 'ifAiBeautyScore':
        case 'ifAiCategory':
        case 'ifAiKeywords':
          memo['AIDetection'] = memo['AIDetection'] || [];
          if (key === 'ifAiQualityScore') memo['AIDetection'].push(AIService.AI质量评分);
          if (key === 'ifAiBeautyScore') memo['AIDetection'].push(AIService.AI美学评分);
          if (key === 'ifAiCategory') memo['AIDetection'].push(AIService.AI分类);
          if (key === 'ifAiKeywords') memo['AIDetection'].push(AIService['AI自动标题/关键词']);
          break;
        case 'name':
        case 'assetType':
        case 'assignType':
          memo[key] = v + '';
          break;
        case 'id':
          memo[key] = v;
          break;
        default:
      }
      return memo;
    }, {});

    return value;
  };

  // 创建数据源
  const createSource = (modalType, initialValues?) => {
    let form;
    const mod = modal({
      width: 720,
      title: `${modalType === ModalType.修改数据来源 ? '编辑' : '创建'}数据来源`,
      content: <CreateDataModal saveRef={f => (form = f)} initialValues={initialValues} />,
      onOk
    });

    async function onOk() {
      const values = await form.validateFields();

      if (values.errorFields) return;

      try {
        if (modalType === ModalType.创建数据来源) {
          await compose(providerService.add, makeRequestPayLoad)(values);
        } else {
          await compose(v => providerService.modify(initialValues.id, v), makeRequestPayLoad)(values);
        }
        mod.close();
        fetchData(query);
      } catch (e) {
        message.info(e.message);
      }
    }
  };

  // 开通/禁用数据源
  const closeSource = async (values: any, requestStatus: OsiDbProviderStatus) => {
    const mod = modal({
      title: `是否确认${options.map(OsiDbProviderStatus)[requestStatus]}`,
      onOk
    });

    async function onOk() {
      try {
        await providerService.modify(values.id, {
          name: values.name,
          status: requestStatus
        });
        mod.close();
        fetchData(query);
      } catch (e) {
        message.info(e.message);
      }
    }
  };

  const columns: Column[] = [
    {
      title: '序号',
      dataIndex: 'index'
    },
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: value => value
    },
    { title: '数据来源名称', dataIndex: 'name' },
    {
      title: '审核类型',
      dataIndex: 'auditFlows',
      render: v => {
        return (
          <>
            {v &&
              v
                .split(',')
                .sort()
                .map(v => <div>{options.map(AuditType)[v]}</div>)}
          </>
        );
      }
    },
    { title: '分配', dataIndex: 'assignType', render: v => options.map(AssignType)[v] },
    { title: '资源类型', dataIndex: 'assetType', render: v => options.map(AssetType)[v] },
    {
      title: '敏感检测',
      dataIndex: 'sensitiveCheckType',
      render: v => {
        return (
          <>
            {v &&
              v
                .split(',')
                .sort()
                .map(v => <div>{options.map(SensitiveCheckType)[v]}</div>)}
          </>
        );
      }
    },
    {
      title: 'AI服务',
      render: (value, tr) => {
        return (
          <>
            {tr.ifAiQualityScore && <div>AI质量评分</div>}
            {tr.ifAiBeautyScore && <div>AI美学评分</div>}
            {tr.ifAiCategory && <div>AI分类</div>}
            {tr.ifAiKeywords && <div>AI自动标题/关键词</div>}
          </>
        );
      }
    },
    { title: '创建人', dataIndex: 'createdName' },
    { title: '状态', dataIndex: 'status', render: v => options.map(OsiDbProviderStatus)[v] },
    {
      title: '操作',
      render: (v, tr) => {
        // 需要修改之后的状态
        const requestStatus =
          tr.status == OsiDbProviderStatus.开通 ? OsiDbProviderStatus.关闭 : OsiDbProviderStatus.开通;
        return (
          <>
            <Button
              type="text"
              onClick={() => compose(v => createSource(ModalType.修改数据来源, v), makeResponsePayload)(tr)}
            >
              编辑
            </Button>
            <Button type="text" onClick={() => closeSource(tr, requestStatus)}>
              {options.map(OsiDbProviderStatus)[requestStatus]}
            </Button>
          </>
        );
      }
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => createSource(ModalType.创建数据来源)}>
        创建数据来源
      </Button>
      <Table
        loading={loading}
        bordered
        columns={columns}
        dataSource={list.map((l, i) => Object.assign(l, { index: i + 1 }))}
      />
      ;
    </>
  );
}

export default List;
