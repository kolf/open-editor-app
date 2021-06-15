import useRequest from '@ahooksjs/use-request';
import { Button, Checkbox, Form, Input, Radio, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Loading from 'src/components/common/Loading';
import {
  AIDetection,
  AssetFamily,
  assetFamilyMap,
  AssetType,
  DistributeMode,
  SensitiveDetection
} from 'src/declarations/enums/query';
import providerService from 'src/services/providerService';
import { RootState } from 'src/store';
import modal from 'src/utils/modal';

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
    dataIndex: 'createTime'
  },
  { title: '名称', dataIndex: 'name' },
  { title: '分配', dataIndex: '' },
  {
    title: '资源类型',
    render: (value, tr) => {
      return assetFamilyMap[tr.assetFamily];
    }
  },
  { title: '敏感检测', dataIndex: '' },
  { title: 'Ai检测', dataIndex: '' },
  { title: '创建人', dataIndex: '' },
  { title: '状态', dataIndex: '' },
  {
    title: '操作',
    render: () => {
      return (
        <>
          <div>编辑</div>
          <div>关闭</div>
        </>
      );
    }
  }
];

function CreateDataModal({ getFormData }) {
  return (
    <>
      <Form onValuesChange={v => getFormData(v)}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称！' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="审核类型" name="assetType" rules={[{ required: true, message: '请选择审核类型！' }]}>
          <Radio.Group>
            {Object.keys(AssetType).map(t => (
              <Radio value={AssetType[t]}>{t}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="分配" name="distributeMode" rules={[{ required: true, message: '请选择分配！' }]}>
          <Radio.Group>
            {Object.keys(DistributeMode).map(t => (
              <Radio value={DistributeMode[t]}>
                {DistributeMode[t] === DistributeMode.自动 ? `${t}（全部资源）` : t}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="资源类型" name="assetFamily" rules={[{ required: true, message: '请选择资源类型！' }]}>
          <Radio.Group>
            {Object.keys(AssetFamily).map(t => (
              <Radio value={AssetFamily[t]}>{t}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="敏感检测" name="sensitiveDetection" rules={[{ required: true, message: '请选择敏感检测！' }]}>
          <Radio.Group>
            {Object.keys(SensitiveDetection).map(t => (
              <Radio value={SensitiveDetection[t]}>{t}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="AI检测" name="AIDetection" rules={[{ required: true, message: '请选择AI检测！' }]}>
          <Checkbox.Group>
            {Object.keys(AIDetection).map(t => {
              return <Checkbox value={AIDetection[t]}>{t}</Checkbox>;
            })}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </>
  );
}

function List() {
  const [query, setQuery] = useState({ pageNum: 1, pageSize: 60 });
  const user = useSelector((state: RootState) => state.user.user);
  const {
    data = { list: [], total: 0 },
    loading,
    run: fetchData
  } = useRequest(providerService.getList, { manual: true });
  const { list, total } = data;

  useEffect(() => {
    fetchData(query);
  }, [query]);

  const createSource = () => {
    const t = {};
    const getFormData = v => Object.assign(t, v);
    const mod = modal({
      width: 720,
      title: '创建数据来源',
      content: <CreateDataModal getFormData={getFormData} />,
      onOk
    });

    async function onOk() {
      try {
        await providerService.add(t);
      } catch (e) {
        console.log(e, 111);
      }
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <Button type="primary" onClick={createSource}>
        创建数据来源
      </Button>
      <Table bordered columns={columns} dataSource={list} />;
    </>
  );
  // return <div onClick={openModal}>数据来源管理</div>;
}

export default List;
