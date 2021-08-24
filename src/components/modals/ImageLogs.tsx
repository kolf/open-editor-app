import React from 'react';
import { Table } from 'antd';

interface Props {
  dataSource: any;
}

const columns = [
  {
    title: '编审时间',
    dataIndex: 'createdTime',
    width: 130
  },
  {
    title: '编审人',
    dataIndex: 'userName',
    width: 120
  },
  {
    title: '编审内容',
    dataIndex: 'message'
  }
];

const ImageLogs = ({ dataSource = [] }: Props) => (
  <Table rowKey="id" dataSource={dataSource} size="small" pagination={false} columns={columns} />
);

export default ImageLogs;
