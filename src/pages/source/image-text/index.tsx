import { useRequest } from 'ahooks';
import { Table, Button, message } from 'antd';
import moment from 'moment';
import React, { useContext } from 'react';
import { useEffect, useState, useRef } from 'react';
import config from 'src/config';
import options, {
  AIDetection,
  AIService,
  AuditType,
  BatchAssignMode,
  BatchAssignStatus,
  BatchAuditType,
  BatchStatus,
  IfSensitiveCheckBool,
  Priority
} from 'src/declarations/enums/query';
import bacthService from 'src/services/batchService';
import modal from 'src/utils/modal';
import FormList from './FormList';
import AssignForm from './AssignForm';
import { useDocumentTitle } from 'src/hooks/useDom';
import Toolbar from 'src/components/list/Toolbar';
import { DataContext } from 'src/components/contexts/DataProvider';

function VcgImageText() {
  useDocumentTitle('数据分配-创意类质量审核-VCG内容审核管理平台');
  const [query, setQuery] = useState({ 
    pageNum: 1, 
    pageSize: 60,
    assignStatus: BatchAssignStatus.未分配,
    auditStage: AuditType.质量审核
  });
  const { providerOptions } = useContext(DataContext);

  const {
    data = { list: [], total: 0 },
    loading,
    run: fetchData,
    refresh
  } = useRequest(bacthService.getList, {
    manual: true,
    ready: !!providerOptions
  });

  useEffect(() => {
    fetchData(query);
  }, [query]);

  // 数据分配弹窗
  function assignData(osiBatchId) {
    let formRef = null;
    const mod = modal({
      width: 500,
      title: '数据分配',
      content: <AssignForm saveRef={r => (formRef = r)} />,
      onOk,
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
        await bacthService.assign(values);
        mod.close();
        message.success(`设置分配成功！`);
        refresh();
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
    { title: '序号', align: 'center', dataIndex: 'index' },
    { title: 'ID', align: 'center', dataIndex: 'id' },
    {
      title: '入库时间',
      width: 100,
      align: 'center',
      dataIndex: 'createdTime',
      render: value => moment(value).format(config.data.SECOND_FORMAT)
    },
    { title: '数据来源', width: 140, align: 'center', dataIndex: 'osiDbProviderId', render: value => providerMap[value] },
    { title: '分配', align: 'center', dataIndex: 'assignMode', render: value => options.map(BatchAssignMode)[value] },
    {
      title: '敏感检测',
      width: 80,
      align: 'center',
    },
    { title: '数量', align: 'center', dataIndex: 'quantity' },
    { title: '优先级', align: 'center', dataIndex: 'priority', render: value => options.map(Priority)[value] },
    {
      title: '分配状态',
      align: 'center',
      dataIndex: 'assignStatus',
      render: value => options.map(BatchAssignStatus)[value]
    },
    {
      title: '分配时间',
      width: 100,
      align: 'center',
      dataIndex: 'assignTime',
      render: value => (value && moment(value).format(config.data.SECOND_FORMAT)) || '-'
    },
    {
      title: '分配对象',
      align: 'center',
      dataIndex: 'auditorName',
      render: value => {
        return (
          value &&
          value.split(',').map(name => (
            <>
              <div>{name}</div>
            </>
          ))
        );
      }
    },
    { title: '分配人', align: 'center', dataIndex: 'assignerName' },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (value, tr) => {
        // 分配状态为分配中、分配完成， 或入库状态为入库中，分配按钮禁用
        return (
          <Button
            disabled={tr.assignStatus != BatchAssignStatus.未分配 || tr.status == BatchStatus.入库中}
            type="text"
            onClick={() => assignData(tr.id)}
          >
            分配
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
      <FormList onChange={formListOnChange} {...query}/>
      <Toolbar
        pagerProps={{
          total: data.total,
          current: query.pageNum,
          pageSize: query.pageSize,
          onChange: values => {
            setQuery({ ...query, ...values });
          }
        }}
      ></Toolbar>
      <Table
        pagination={false}
        dataSource={data.list.map((l, i) => Object.assign(l, { index: i + 1 }))}
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
