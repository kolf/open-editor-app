import useRequest from '@ahooksjs/use-request';
import { Button, Checkbox, Form, Input, Radio, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Loading from 'src/components/common/Loading';
import options, {
  AIDetection,
  AssetFamily,
  AssetType,
  AssignType,
  IfSensitiveCheck,
  OsiDbProviderStatus
} from 'src/declarations/enums/query';
import providerService from 'src/services/providerService';
import { RootState } from 'src/store';
import modal from 'src/utils/modal';

enum ModalType {
  创建数据来源,
  修改数据来源
}

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
    render: value => value && new Date(value).toLocaleDateString()
  },
  { title: '名称', dataIndex: 'name' },
  {
    title: '分配',
    dataIndex: 'assignType',
    render: value => options.map(AssignType)[value]
  },
  {
    title: '资源类型',
    dataIndex: 'assetFamily',
    render: value => options.map(AssetFamily)[value]
  },
  {
    title: '敏感检测',
    dataIndex: 'ifSensitveCheck',
    render: value => options.map(IfSensitiveCheck)[value]
  },
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
  { title: '创建人', dataIndex: 'createdName' },
  {
    title: '状态',
    dataIndex: 'status',
    render: value => options.map(OsiDbProviderStatus)[value]
  },
  {
    title: '操作',
    render: () => {
      return (
        <>
          <Button type="text">编辑</Button>
          <Button type="text">关闭</Button>
        </>
      );
    }
  }
];

// 弹窗表单
function CreateDataModal({ getFormData }) {
  return (
    <>
      <Form onValuesChange={v => getFormData(v)}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称！' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="审核类型" name="assetType" rules={[{ required: true, message: '请选择审核类型！' }]}>
          <Radio.Group>
            {Object.keys(AssetType).map((t, i) => (
              <Radio key={`${t}${i}`} value={AssetType[t]}>
                {t}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="分配" name="assignType" rules={[{ required: true, message: '请选择分配！' }]}>
          <Radio.Group>
            {Object.keys(AssignType).map((t, i) => (
              <Radio value={AssignType[t]} key={`${t}${i}`}>
                {AssignType[t] === AssignType.自动 ? `${t}（全部资源）` : t}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="资源类型" name="assetFamily" rules={[{ required: true, message: '请选择资源类型！' }]}>
          <Radio.Group>
            {Object.keys(AssetFamily).map((t, i) => (
              <Radio key={`${t}${i}`} value={AssetFamily[t]}>
                {t}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="敏感检测" name="ifSensitveCheck" rules={[{ required: true, message: '请选择敏感检测！' }]}>
          <Radio.Group>
            {Object.keys(IfSensitiveCheck).map((t, i) => (
              <Radio key={`${t}${i}`} value={IfSensitiveCheck[t]}>
                {t}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="AI检测" name="AIDetection" rules={[{ required: true, message: '请选择AI检测！' }]}>
          <Checkbox.Group>
            {Object.keys(AIDetection).map((t, i) => {
              return (
                <Checkbox key={`${t}${i}`} value={AIDetection[t]}>
                  {t}
                </Checkbox>
              );
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

  function makeCreatePayLoad(payload) {
    const result = Object.keys(payload).reduce(
      (memo, p) => {
        switch (p) {
          case 'AIDetection':
            const v = payload[p] || [];
            if (v.includes(AIDetection.AI质量评分)) memo['ifAiQualityScore'] = '1';
            if (v.includes(AIDetection.AI美学评分)) memo['ifAiBeautyScore'] = '1';
            if (v.includes(AIDetection.AI分类)) memo['ifAiCategory'] = '1';
            Reflect.deleteProperty(payload, p);
            break;
          default:
            memo[p] = payload[p];
        }
        return memo;
      }, {});
    return result;
  }

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
        await providerService.add(makeCreatePayLoad(t));
      } catch (e) {
        console.log(e, 111);
      }
    }
  };

  const updateSource = () => {}

  return (
    <>
      <Button type="primary" onClick={() => createSource()}>
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
