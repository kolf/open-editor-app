import React, { ReactElement, useState, useRef } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import { Card, Table } from 'antd';
import { useRequest } from 'ahooks';
import { useQuery } from 'src/hooks/useQueryParam';
import { useDocumentTitle } from 'src/hooks/useDom';
import imageService from 'src/services/imageService';

import './style.less';

interface Props {}

function isPdf(url: string) {
  return url.endsWith('.pdf') || !url.endsWith('.jpg');
}

function makeData(data: any) {
  if (!data) {
    return [];
  }
  return data.map((item, index) => ({ ...item, index: index + 1 }));
}

export default function LicenseType({}: Props): ReactElement {
  useDocumentTitle(`版权文件-VCG内容审核管理平台`);
  const { id } = useQuery();
  const { data, loading, error } = useRequest(() => imageService.getLicenseList({ imageId: id }), { initialData: [] });
  const [index, setIndex] = useState(-1);

  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);

  const { pdfDocument, pdfPage } = usePdf({
    file: 'https://projects.wojtekmaj.pl/react-pdf/static/sample.49a87e34.pdf',
    page,
    canvasRef
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60
    },
    {
      title: '文件名',
      dataIndex: 'name',
      render: (text, creds) => (
        <div className="click-row" onClick={e => handleRowClick(creds)}>
          {text}
        </div>
      )
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
    if (index === -1 && i === 0) {
      return 'isActive';
    }
    return i === index ? 'isActive' : '';
  };

  const renderMain = () => {
    if (data.length === 0) {
      return null;
    }
    const fileUrl = data[index === -1 ? 0 : index].url;
    console.log(fileUrl, 'fileUrl');
    if (isPdf(fileUrl)) {
      return (
        <div>
          {!pdfDocument && <span>Loading...</span>}
          <canvas ref={canvasRef} />
          {Boolean(pdfDocument && pdfDocument.numPages) && (
            <nav>
              <ul className="pager">
                <li className="previous">
                  <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </button>
                </li>
                <li className="next">
                  <button disabled={page === pdfDocument.numPages} onClick={() => setPage(page + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      );
    }
    return <img src={fileUrl} />;
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
          <div className="license-main">{renderMain()}</div>
        </div>
      </Card>
    </div>
  );
}
