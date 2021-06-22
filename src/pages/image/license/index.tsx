import React, { ReactElement } from 'react';
import { Card, Table } from 'antd';
import { useRequest } from 'ahooks';
import { useQuery } from 'src/hooks/useQueryParam';
import imageService from 'src/services/imageService';
import './style.less';

interface Props {}

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 60
  },
  {
    title: '文件名',
    dataIndex: 'name',
    render: text => <div>{text}</div>
  },
  {
    title: '操作',
    dataIndex: 'url',
    width: 72,
    render: text => (
      <a href={text} target="_blank">
        查看源文件
      </a>
    )
  }
];

export default function LicenseType({}: Props): ReactElement {
  const { id } = useQuery();
  const { data, loading, error } = useRequest(() => imageService.getLicenseList({ imageId: id }));
  return (
    <div className="license-root">
      <Card title="肖像权/物权文件" bordered={false} style={{ width: 1200 }}>
        <div className="license-inner">
          <div className="license-sidebar">
            <Table dataSource={data} columns={columns} pagination={false} loading={loading} />
          </div>
          <div className="license-main">
            <img />
          </div>
        </div>
      </Card>
    </div>
  );
}
