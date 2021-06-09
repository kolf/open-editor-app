import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Table, Space, Tag } from 'antd';
import FormList from './FormList';
import imageService from 'src/services/imageService';

function List() {
  const [query, setQuery] = useState({ assetFamily: 2, desc: 2, pageType: 21, pageNum: 1, pageSize: 60 });
  const { isFetching, error, data } = useQuery('images', imageService.getList);

  const columns = [
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
      dataIndex: 'age'
    },
    {
      title: '名称',
      dataIndex: 'address'
    },
    {
      title: '审核类型',
      dataIndex: 'address'
    },
    {
      title: '分配',
      dataIndex: 'address'
    },
    {
      title: '资源类型',
      dataIndex: 'address'
    },
    {
      title: '敏感检测',
      dataIndex: 'address'
    },
    {
      title: 'AI检测',
      dataIndex: 'address'
    },
    {
      title: '创建人',
      dataIndex: 'address'
    },
    {
      title: '状态',
      dataIndex: 'address'
    },
    {
      title: '操作',
      dataIndex: 'options',
      width: 120,
      render(text, creds) {
        return (
          <Space>
            <Tag>编辑</Tag>
            <Tag>关闭</Tag>
          </Space>
        );
      }
    }
  ];
  return (
    <>
      <FormList onChange={setQuery} />
      <div className="gap-top">
        <Table rowKey="id" columns={columns} loading={isFetching} dataSource={[]} />
      </div>
    </>
  );
}

export default List;
