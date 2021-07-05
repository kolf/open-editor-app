import { useRequest } from 'ahooks';
import { Table, Button, message } from 'antd';
import moment from 'moment';
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import config from 'src/config';
import options, {
  AIDetection,
  BatchAssignMode,
  BatchAssignStatus,
  BatchAuditType,
  BatchStatus,
  IfSensitveCheck,
  Priority
} from 'src/declarations/enums/query';
import bacthService from 'src/services/batchService';
import modal from 'src/utils/modal';
import FormList from './FormList';
import AssignForm from './AssignForm';
import { useDocumentTitle } from 'src/hooks/useDom';
import Toolbar from 'src/components/list/Toolbar';

function VcgImageText() {
  useDocumentTitle('数据分配-创意类质量审核-VCG内容审核管理平台');
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });

  const {
    data = { list: [], total: 0 },
    loading,
    run: fetchData,
    refresh
  } = useRequest(bacthService.getList, { manual: true });

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
      autoIndex: false
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

  const columns: Column[] = [
    { title: '序号', dataIndex: 'index' },
    { title: 'ID', dataIndex: 'id' },
    {
      title: '入库时间',
      width: 100,
      dataIndex: 'createdTime',
      render: value => moment(value).format(config.data.SECOND_FORMAT)
    },
    { title: '名称', width:140, dataIndex: 'name' },
    { title: '审核类型', width: document.documentElement.clientWidth < 1400 && 120, dataIndex: 'auditFlow', render: value => options.map(BatchAuditType)[value] },
    { title: '分配', dataIndex: 'assignMode', render: value => options.map(BatchAssignMode)[value] },
    { title: '优先级', dataIndex: 'priority', render: value => options.map(Priority)[value] },
    { title: '敏感检测', width: 80, dataIndex: 'ifSensitveCheck', render: value => options.map(IfSensitveCheck)[value] },
    {
      title: 'AI检测',
      width: 80,
      render: (value, tr) => {
        return (
          <>
            {tr.ifAiQualityScore && <div>AI质量评分</div>}
            {tr.ifAiBeautyScore && <div>AI美学评分</div>}
            {tr.ifAiCategory && <div>AI分类</div>}
          </>
        );
      }
    },
    { title: '数量', dataIndex: 'quantity' },
    {
      title: '分配时间',
      width: 100,
      dataIndex: 'assignTime',
      render: value => (value && moment(value).format(config.data.SECOND_FORMAT)) || '-'
    },
    { title: '分配状态', dataIndex: 'assignStatus', render: value => options.map(BatchAssignStatus)[value] },
    {
      title: '分配对象',
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
    { title: '分配人', dataIndex: 'assignerName' },
    {
      title: '操作',
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
  ].map<Column>(c => {
    c.align = 'center';
    return c;
  });

  const formListOnChange = values => {
    const nextQuery = { ...values, pageNum: 1 };
    const result = Object.keys(nextQuery).reduce(
      (memo, q) => {
        switch (q) {
          case 'createdTime':
            if (nextQuery[q]) {
              const date = moment(nextQuery[q]).format(config.data.DATE_FORMAT);
              memo[q] = `${date} 00:00:00,${date} 23:59:59`;
            } else {
              Reflect.deleteProperty(memo, q);
            }
            break;
          case 'aiDetection':
            Reflect.deleteProperty(memo, 'ifAiQualityScore');
            Reflect.deleteProperty(memo, 'ifAiBeautyScore');
            Reflect.deleteProperty(memo, 'ifAiCategory');
            if (nextQuery[q] === AIDetection.AI质量评分) memo['ifAiQualityScore'] = '1';
            if (nextQuery[q] === AIDetection.AI美学评分) memo['ifAiBeautyScore'] = '1';
            if (nextQuery[q] === AIDetection.AI分类) memo['ifAiCategory'] = '1';
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
      <FormList onChange={formListOnChange} />
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
