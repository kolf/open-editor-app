import React, { ReactElement, useState } from 'react';
import { Card, Table } from 'antd';
import { useRequest } from 'ahooks';
import { useQuery } from 'src/hooks/useQueryParam';
import imageService from 'src/services/imageService';
import './style.less';

interface Props {}

function makeData(data: any) {
  if (!data) {
    return [];
  }
  return data.map((item, index) => ({ ...item, index: index + 1 }));
}

export default function LicenseType({}: Props): ReactElement {
  const { id } = useQuery();
  const { data, loading, error } = useRequest(() => imageService.getLicenseList({ imageId: id }), { initialData: [] });
  const [index, setIndex] = useState(-1);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60
    },
    {
      title: '文件名',
      dataIndex: 'name',
      render: (text, creds) => <div className='click-row' onClick={e => handleRowClick(creds)}>{text}</div>
    },
    {
      title: '操作',
      dataIndex: 'url',
      width: 100,
      render: text => (
        <a href={text} target="_blank">
          查看源文件
        </a>
      )
    }
  ];

  const handleRowClick = row => {
    const index = data.findIndex(item => item.id === row.id);
    setIndex(index);
    console.log(index, 'res');
  };

  const getRowClassName = (row, i) => {
    if (!data || data.length === 0) {
      return;
    }
    if (index === -1 && i===0) {
      return 'isActive';
    }
    return i === index ? 'isActive' : '';
  };

  return (
    <div className="license-root">
      <Card title="肖像权/物权文件" bordered={false} style={{ width: 1200 }}>
        <div className="license-inner">
          <div className="license-sidebar">
            <Table
              rowClassName={getRowClassName}
              dataSource={makeData(data)}
              columns={columns}
              pagination={false}
              loading={loading}
            />
          </div>
          <div className="license-main">{data.length > 0 && <img src={data[index === -1 ? 0 : index].url} />}</div>
        </div>
      </Card>
    </div>
  );
}
