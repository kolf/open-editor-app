import { useRequest } from 'ahooks';
import { Table, Button, message } from 'antd';
import moment from 'moment';
import React, { useContext } from 'react';
import { useEffect, useState } from 'react';
import config from 'src/config';
import {
  AIService,
  AuditType,
  BatchAssignMode,
  BatchAssignStatus,
  BatchStatus,
  Priority,
  SensitiveCheckType
} from 'src/declarations/enums/query';
import bacthService from 'src/services/batchService';
import modal from 'src/utils/modal';
import FormList from './FormList';
import AssignForm from './AssignForm';
import { useDocumentTitle } from 'src/hooks/useDom';
import Toolbar from 'src/components/list/Toolbar';
import { DataContext } from 'src/components/contexts/DataProvider';
import { FormattedMessage, useIntl } from 'react-intl';
import { getTableDisplay } from 'src/utils/tools';

function VcgImageText() {
  useDocumentTitle('数据分配-创意类质量审核-VCG内容审核管理平台');
  const [query, setQuery] = useState({
    pageNum: 1,
    pageSize: 60,
    assignStatus: BatchAssignStatus.未分配,
    auditStage: AuditType.质量审核
  });
  const { providerOptions } = useContext(DataContext);
  const intl = useIntl();

  const {
    data,
    loading,
    refresh
  } = useRequest(() => bacthService.getList(query), {
    ready: !!providerOptions,
    refreshDeps: [query]
  });


  const { list, total } = data || {
    list: [], total: 0
  };

  // 数据分配弹窗
  function assignData(osiBatchId) {
    let formRef = null;
    const mod = modal({
      width: 500,
      title: <FormattedMessage id="Data Distribution" />,
      content: <AssignForm saveRef={r => (formRef = r)} />,
      onOk
      // autoIndex: false
    });

    async function onOk() {
      const values = await formRef.validateFields();
      if (values.errorFields) return;
      try {
        mod.confirmLoading();
        if (values.userList) {
          values.userList = values.userList.map(u => ({ id: u.value, name: u.label }));
        }
        values.osiBatchId = osiBatchId;
        await bacthService
          .assign(values)
          .then(() => {
            message.success(intl.formatMessage({ id: 'Distribution Success' }));
            refresh();
          })
          .catch(err => {
            message.error(err.message);
          })
          .finally(mod.close);
      } catch (e) {
        mod && mod.close();
        e && message.error(e);
      }
    }
  }

  const providerMap =
    providerOptions &&
    providerOptions.reduce((memo, provider) => {
      memo[provider.value] = provider.label;
      return memo;
    }, {});

  const columns: Column[] = [
    { title: <FormattedMessage id="No." />, align: 'center', dataIndex: 'index' },
    { title: 'ID', align: 'center', dataIndex: 'id' },
    {
      title: <FormattedMessage id="Submission Date" />,
      width: 100,
      align: 'center',
      dataIndex: 'createdTime',
      render: value => moment(value).format(config.data.SECOND_FORMAT)
    },
    {
      title: <FormattedMessage id="Data Source" />,
      width: 140,
      align: 'center',
      dataIndex: 'osiDbProviderId',
      render: value => providerMap[value]
    },
    {
      title: <FormattedMessage id="Distribution" />,
      align: 'center',
      dataIndex: 'assignMode',
      render: value => {
        const text = getTableDisplay(value, BatchAssignMode);
        return text && <FormattedMessage id={text} />;
      }
    },
    {
      title: <FormattedMessage id="NSFW Scan" />,
      width: 80,
      align: 'center',
      dataIndex: 'sensitiveCheckType',
      render: value => {
        console.log(value, 'value');
        const texts = (value && value.split(',').map(v => getTableDisplay(v, SensitiveCheckType))) || [];
        return (
          (texts.length > 0 &&
            texts.map((t, i) => {
              return (
                <div key={i}>
                  <FormattedMessage id={t} />
                </div>
              );
            })) ||
          ''
        );
      }
    },
    { title: <FormattedMessage id="Amount" />, align: 'center', dataIndex: 'quantity' },
    {
      title: <FormattedMessage id="Priority" />,
      align: 'center',
      dataIndex: 'priority',
      render: value => value && <FormattedMessage id={getTableDisplay(value, Priority)} />
    },
    {
      title: <FormattedMessage id="Distribution Stats" />,
      align: 'center',
      dataIndex: 'assignStatus',
      render: value => value && <FormattedMessage id={getTableDisplay(value, BatchAssignStatus)} />
    },
    {
      title: <FormattedMessage id="Distribution Date" />,
      width: 100,
      align: 'center',
      dataIndex: 'assignTime',
      render: value => (value && moment(value).format(config.data.SECOND_FORMAT)) || '-'
    },
    {
      title: <FormattedMessage id="Editors" />,
      align: 'center',
      dataIndex: 'auditorName',
      render: value => {
        return (
          value &&
          value.split(',').map((name, i) => (
            <>
              <div key={i}>{name}</div>
            </>
          ))
        );
      }
    },
    { title: <FormattedMessage id="Administrators" />, align: 'center', dataIndex: 'assignerName' },
    {
      title: <FormattedMessage id="Actions" />,
      align: 'center',
      fixed: 'right',
      render: (value, tr) => {
        // 分配状态为分配中、分配完成， 或入库状态为入库中，分配按钮禁用
        return (
          <Button
            disabled={!(tr.status + '' === BatchStatus.入库完成 && tr.assignStatus === 1)}
            type="text"
            onClick={() => assignData(tr.id)}
          >
            <FormattedMessage id="Distribution" />
          </Button>
        );
      }
    }
  ];

  const formListOnChange = values => {
    const nextQuery = { ...values, pageNum: 1 };
    const result = Object.keys(nextQuery).reduce(
      (memo, q) => {
        switch (q) {
          case 'createdTime':
            if (nextQuery[q]) {
              const [start, end] = nextQuery[q];

              memo[q] = `${start.format(config.data.DATE_FORMAT)} 00:00:00,${end.format(
                config.data.DATE_FORMAT
              )} 23:59:59`;
            } else {
              Reflect.deleteProperty(memo, q);
            }
            break;
          case 'aiDetection':
            Reflect.deleteProperty(memo, 'ifAiQualityScore');
            Reflect.deleteProperty(memo, 'ifAiBeautyScore');
            Reflect.deleteProperty(memo, 'ifAiCategory');
            Reflect.deleteProperty(memo, 'ifAiKeywords');
            if (nextQuery[q] === AIService.AI质量评分) memo['ifAiQualityScore'] = '1';
            if (nextQuery[q] === AIService.AI美学评分) memo['ifAiBeautyScore'] = '1';
            if (nextQuery[q] === AIService.AI分类) memo['ifAiCategory'] = '1';
            if (nextQuery[q] === AIService['AI自动标题/关键词']) memo['ifAiKeywords'] = '1';
            break;
          case 'userList':
            memo['auditorId'] = nextQuery[q].map(u => u.value).join(',');
            break;
          case 'osiProviderId':
            memo[q] = nextQuery[q] && nextQuery[q].value;
            break;
          default:
            memo[q] = nextQuery[q];
        }
        return memo;
      },
      { ...query }
    );
    setQuery(result);
  };

  return (
    <>
      <FormList onChange={formListOnChange} {...query} />
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
        dataSource={list.map((l, i) => Object.assign(l, { index: i + 1 }))}
        columns={columns}
        bordered
        loading={loading}
        size="small"
        scroll={{ x: 'max-content' }}
      />
    </>
  );
}

export default VcgImageText;
