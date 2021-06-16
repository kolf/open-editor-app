import { useRequest } from 'ahooks';
import { Table, Button } from 'antd';
import moment from 'moment';
import React from 'react';
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import { useEffect, useState, useRef } from 'react';
import config from 'src/config';
import options, { BatchAssignMode, BatchAssignStatus, BatchAuditType, IfSensitveCheck } from 'src/declarations/enums/query';
import bacthService from 'src/services/batchService';
import modal from 'src/utils/confirm';
import { FormList } from './FormList';

function VcgImageText() {
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const assignModalRef = useRef();
  const {
    data = { list: [], total: 0 },
    loading,
    run: fetchData,
    refresh
  } = useRequest(bacthService.getList, { manual: true });

  function assign (assignModalRef){
    modal({
      width: 500,
      title: '数据分配',
      content: <AssignModal ref={assignModalRef}/>,
      onOk
    })
    async function onOk() {
      console.log(assignModalRef.current.getModalData())
    }
  }

  const columns: Column[] = [
    { title: '序号', dataIndex: 'index' },
    { title: 'ID', dataIndex: 'id' },
    { title: '入库时间', dataIndex: 'createdTime', render: value => moment(value).format(config.data.SECOND_FORMAT) },
    { title: '名称', dataIndex: 'name' },
    { title: '审核类型', dataIndex: 'auditFlow', render: value => options.map(BatchAuditType)[value] },
    { title: '分配', dataIndex: 'assignMode', render: value => options.map(BatchAssignMode)[value] },
    { title: '优先级', dataIndex: 'priority' },
    { title: '敏感检测', dataIndex: 'ifSensitveCheck', render: value => options.map(IfSensitveCheck)[value] },
    {
      title: 'AI检测',
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
    { title: '分配时间', dataIndex: 'assignTime', render: value => value && moment(value).format(config.data.SECOND_FORMAT) || '-' },
    { title: '分配状态', dataIndex: 'assignStatus', render: value => options.map(BatchAssignStatus)[value] },
    { title: '分配对象', dataIndex: '' },
    { title: '分配人', dataIndex: 'assignerName' },
    {
      title: '操作',
      render: (value, tr) => {
        return <Button disabled={ tr.assignStatus != BatchAssignStatus.未分配 } type='text' onClick={assign}>分配</Button>;
      }
    }
  ];

  useEffect(() => {
    fetchData(query);
  }, [query]);

  return (
    <>
      <FormList onChange={values => setQuery({ ...query, ...values, pageNum: 1 })} />
      <Table
        dataSource={data.list.map((l, i) => Object.assign(l, { index: i + 1 }))}
        columns={columns}
        bordered
        loading={loading}
      />
    </>
  );
}

const AssignModal =  React.forwardRef((props, ref) => {
  const [modalData, setModalData] = useState({a: 1, b: 2});

  useImperativeHandle(ref, () => ({
    getModalData: () => {
      return modalData
    }
  }))

  return <div>1</div>;
})

export default VcgImageText;
