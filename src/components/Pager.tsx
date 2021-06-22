import React, { ReactElement } from 'react';
import { Select, Pagination, Space } from 'antd';
const { Option } = Select;

export interface IPagerProps {
  total?: number;
  onChange?: any;
  current: number;
  pageSize: number
}

const pageOptions = [
  { value: '60', label: '60条/页' },
  { value: '100', label: '100条/页' },
  { value: '200', label: '200条/页' }
];

function Pager({ onChange, ...otherProps }: IPagerProps): ReactElement {
  const pageProps = {
    simple: true,
    ...otherProps,
    onChange: pageNum => {
      onChange({
        pageNum: pageNum
      });
    }
  };
  return (
    <Space>
      <span>共{otherProps.total}条数据</span>
      <Pagination {...pageProps} />
      <Select defaultValue={pageOptions[0].value} onChange={pageSize => onChange({ pageSize: pageSize * 1 })}>
        {pageOptions.map(o => (
          <Option key={o.value} value={o.value}>
            {o.label}
          </Option>
        ))}
      </Select>
    </Space>
  );
}

export default Pager;
