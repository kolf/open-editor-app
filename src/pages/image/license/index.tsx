import React, { ReactElement, useState, useRef } from 'react';
import { Card, Table } from 'antd';
import { useRequest } from 'ahooks';
import { useQuery } from 'src/hooks/useQueryParam';
import { useDocumentTitle } from 'src/hooks/useDom';
import imageService from 'src/services/imageService';

import './style.less';
import { useIntl } from 'react-intl';

interface Props {}

function isPdf(url: string) {
  return url.indexOf('.pdf')!==-1
}

function makeData(data: any) {
  if (!data) {
    return [];
  }
  return data.map((item, index) => ({ ...item, index: index + 1 }));
}

export default React.memo(function LicenseType({}: Props): ReactElement {
  const { formatMessage } = useIntl();
  useDocumentTitle(`版权文件-VCG内容审核管理平台`);
  const { id } = useQuery();
  const { data, loading, error } = useRequest(() => imageService.getLicenseList({ imageId: id }), { initialData: [] });
  const [index, setIndex] = useState(-1);

  const columns = [
    {
      title: formatMessage({ id: 'table.column.no' }),
      dataIndex: 'index',
      width: 60
    },
    {
      title: formatMessage({ id: 'table.column.fileName' }),
      dataIndex: 'name',
      render: (text, creds) => (
        <div className="click-row" onClick={e => handleRowClick(creds)}>
          {text}
        </div>
      )
    },
    {
      title: formatMessage({ id: 'table.column.actions' }),
      dataIndex: 'url',
      width: 100,
      render: text => (
        <a href={text} target="_blank">
          {formatMessage({ id: 'image.action.openLiceseFile' })}
        </a>
      )
    }
  ];

  const handleRowClick = row => {
    const index = data.findIndex(item => item.id === row.id);
    setIndex(index);
  };

  const getRowClassName = (row, i) => {
    if (!data || data.length === 0) {
      return;
    }
    if (index === -1 && i === 0) {
      return 'isActive';
    }
    return i === index ? 'isActive' : '';
  };

  const renderMain = () => {
    if (data.length === 0) {
      return null;
    }
    const file = data[index === -1 ? 0 : index];

    if (isPdf(file.url) || isPdf(file.name)) {
      return <iframe src={file.url} frameBorder={0} style={{ width: '100%', height: 760 }} />;
    }

    return <img src={file.url} />;
  };

  return (
    <div className="license-root">
      <Card title={formatMessage({ id: 'image.action.liceseFile' })} bordered={false} style={{ width: 1200 }}>
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
          <div className="license-main">{renderMain()}</div>
        </div>
      </Card>
    </div>
  );
});
