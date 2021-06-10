import { Select, Pagination as Paging } from 'antd';
import { Option } from 'antd/lib/mentions';

interface IListData {
  total: number;
  list: [object?];
}

interface ILoadData {
  (type?: string, filterParams?: any): void;
}

/**
 *
 * @param total 数据总数
 * @param pageNum 页面索引
 * @param pageSize 页面数据数量
 * @param loadData 数据刷新函数
 * @returns React.ReactNode
 */
export default function Pagination({
  total,
  pageNum,
  pageSize,
  loadData
}: {
  total: number;
  pageNum: number;
  pageSize: number;
  loadData: ILoadData;
}) {
  const pageProps = {
    className: 'ant-pager',
    current: pageNum,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal() {
      return '共 ' + total + ' 条';
    },
    onShowSizeChange: (pageSize: number) => {
      loadData('pagination', { pageNum: 1, pageSize });
    },
    onChange: (pageNum: number) => {
      loadData('pagination', { pageNum });
    }
  };

  return (
    <div className="dataTables_paginate pull-right">
      <Select
        value={pageSize + '条/页'}
        onChange={e => {
          pageProps.onShowSizeChange(Number(e));
        }}
      >
        <Option value="60">60条/页</Option>
        <Option value="100">100条/页</Option>
        <Option value="200">200条/页</Option>
      </Select>
      <Paging simple {...pageProps} />
      <div className="total-page"> {'共 ' + total + ' 条'} </div>
    </div>
  );
}
