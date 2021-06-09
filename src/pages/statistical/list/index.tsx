import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

const columns: Column[] = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: 'ID',
    dataIndex: 'index',
  },
  {
    title: '编辑',
    dataIndex: 'user',
  },
  {
    title: '待审核数量',
    dataIndex: 'number',
  },
  {
    title: '审核通过数量',
    dataIndex: 'number',
  },
  {
    title: '审核驳回数量',
    dataIndex: 'number',
  },
  {
    title: '共计',
  },
];

function Statistic() {
  const [statisticList, setStatisticList] = useState([]);

  useEffect(() => {
    console.log(111);
  });

  return <Table columns={columns} dataSource={statisticList} />;
}

export default Statistic;
