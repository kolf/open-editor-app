import useRequest from '@ahooksjs/use-request';
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined';
import { Button, message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import Toolbar from 'src/components/list/Toolbar';
import options, {
  AIService,
  AssetType,
  AssignType,
  AuditType,
  OsiDbProviderStatus,
  SensitiveCheckType
} from 'src/declarations/enums/query';
import { zhCNMap } from 'src/locales/zhCN';
import providerService from 'src/services/providerService';
import modal from 'src/utils/modal';
import { getTableDisplay } from 'src/utils/tools';
import CreateDataModal from './DataSourceForm';

export enum ModalType {
  创建数据来源,
  修改数据来源
}

function List() {
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });

  const {
    data,
    loading,
    run: fetchData
  } = useRequest(providerService.getList, { manual: true });
  const { list, total } = data || {
    list: [], total: 0
  };

  useEffect(() => {
    fetchData(query);
  }, [query]);

  // 发送请求前的数据处理
  function makeRequestPayLoad(payload) {
    const result = Object.keys(payload).reduce((memo, p) => {
      const v = payload[p] || [];

      switch (p) {
        case 'AIDetection':
          memo['ifAiQualityScore'] = v.includes(AIService.AI质量评分) ? 1 : 0;
          memo['ifAiBeautyScore'] = v.includes(AIService.AI美学评分) ? 1 : 0;
          memo['ifAiCategory'] = v.includes(AIService.AI分类) ? 1 : 0;
          memo['ifAiKeywords'] = v.includes(AIService['AI自动标题/关键词']) ? 1 : 0;
          Reflect.deleteProperty(payload, p);
          break;
        case 'auditFlows':
        case 'sensitiveCheckType':
        case 'keywordsReivewTitle':
        case 'keywordsReviewKeywords':
        case 'sensitiveKeywordsTable':
          memo[p] = v ? v.join(',') : [];
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
          memo[key] = v ? v.split(',') : [];
          break;
        // AI服务因字段原因单独处理
        case 'ifAiQualityScore':
        case 'ifAiBeautyScore':
        case 'ifAiCategory':
        case 'ifAiKeywords':
          memo['AIDetection'] = memo['AIDetection'] || [];
          if (key === 'ifAiQualityScore' && v) memo['AIDetection'].push(AIService.AI质量评分);
          if (key === 'ifAiBeautyScore' && v) memo['AIDetection'].push(AIService.AI美学评分);
          if (key === 'ifAiCategory' && v) memo['AIDetection'].push(AIService.AI分类);
          if (key === 'ifAiKeywords' && v) memo['AIDetection'].push(AIService['AI自动标题/关键词']);
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
    const title = `${modalType === ModalType.修改数据来源 ? '编辑' : '创建'}数据来源`;
    let form;
    const mod = modal({
      width: 720,
      title: <FormattedMessage id={zhCNMap[title]} />,
      content: <CreateDataModal saveRef={f => (form = f)} initialValues={initialValues} modalType={modalType} />,
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
    const title = `是否确认${options.map(OsiDbProviderStatus)[requestStatus]}？`;
    const mod = modal({
      title: <FormattedMessage id={zhCNMap[title]} />,
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
      title: <FormattedMessage id="No." />,
      dataIndex: 'index'
    },
    {
      title: <FormattedMessage id="ID" />,
      dataIndex: 'id'
    },
    {
      title: <FormattedMessage id="Created Date" />,
      dataIndex: 'createdTime',
      render: value => value
    },
    { title: <FormattedMessage id="Data Source" />, dataIndex: 'name' },
    {
      title: <FormattedMessage id="Inspection Type" />,
      dataIndex: 'auditFlows',
      render: v => {
        return (
          <>
            {v &&
              v
                .split(',')
                .sort()
                .map(v => {
                  const text = getTableDisplay(v, AuditType);
                  return (
                    text && (
                      <div>
                        <FormattedMessage id={text} />
                      </div>
                    )
                  );
                })}
          </>
        );
      }
    },
    {
      title: <FormattedMessage id="Distribution" />,
      dataIndex: 'assignType',
      render: v => {
        const text = getTableDisplay(v, AssignType);
        return text && <FormattedMessage id={text} />;
      }
    },
    {
      title: <FormattedMessage id="Resource Type" />,
      dataIndex: 'assetType',
      render: v => {
        const text = getTableDisplay(v, AssetType);
        return text && <FormattedMessage id={text} />;
      }
    },
    {
      title: <FormattedMessage id="NSFW Scan" />,
      dataIndex: 'sensitiveCheckType',
      render: v => {
        return (
          <>
            {v &&
              v
                .split(',')
                .sort()
                .map(v => {
                  const text = getTableDisplay(v, SensitiveCheckType);
                  return (
                    text && (
                      <div>
                        <FormattedMessage id={text} />
                      </div>
                    )
                  );
                })}
          </>
        );
      }
    },
    {
      title: <FormattedMessage id="AI" />,
      render: (value, tr) => {
        return (
          <>
            {!!tr.ifAiQualityScore && (
              <div>
                <FormattedMessage id="LAI Quality" />
              </div>
            )}
            {!!tr.ifAiBeautyScore && (
              <div>
                <FormattedMessage id="AAI Aesthetic" />
              </div>
            )}
            {!!tr.ifAiCategory && (
              <div>
                <FormattedMessage id="AI Categories" />
              </div>
            )}
            {!!tr.ifAiKeywords && (
              <div>
                <FormattedMessage id="AI Title-Keywords" />
              </div>
            )}
          </>
        );
      }
    },
    { title: <FormattedMessage id="Creator" />, dataIndex: 'createdName' },
    {
      title: <FormattedMessage id="Status" />,
      dataIndex: 'status',
      render: v => {
        return v == OsiDbProviderStatus.开通 ? (
          <CheckOutlined style={{ color: 'green', fontSize: 18 }} />
        ) : (
          <CloseOutlined style={{ color: 'red', fontSize: 18 }} />
        );
      }
    },
    {
      title: <FormattedMessage id="Actions" />,
      render: (v, tr) => {
        // 需要修改之后的状态
        const requestStatus =
          tr.status == OsiDbProviderStatus.开通 ? OsiDbProviderStatus.关闭 : OsiDbProviderStatus.开通;
        const buttonText = getTableDisplay(requestStatus, OsiDbProviderStatus);
        return (
          <>
            <Button
              type="text"
              onClick={() => compose(v => createSource(ModalType.修改数据来源, v), makeResponsePayload)(tr)}
            >
              <FormattedMessage id="Edit" />
            </Button>
            {buttonText && (
              <Button type="text" onClick={() => closeSource(tr, requestStatus)}>
                <FormattedMessage id={buttonText} />
              </Button>
            )}
          </>
        );
      }
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => createSource(ModalType.创建数据来源)}>
        <FormattedMessage id="Create Data Source" />
      </Button>
      <Toolbar
        pagerProps={{
          total,
          current: query.pageNum,
          pageSize: query.pageSize,
          onChange: values => {
            setQuery({ ...query, ...values });
          }
        }}
      />
      <Table
        pagination={false}
        loading={loading}
        bordered
        columns={columns}
        dataSource={list.map((l, i) => Object.assign(l, { index: i + 1 }))}
      />
    </>
  );
}

export default List;
