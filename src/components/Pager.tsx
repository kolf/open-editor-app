import React, { ReactElement } from 'react';
import { Select, Pagination, Space } from 'antd';
const { Option } = Select;

export interface Props {
  total?: number;
  onChange?: (value: { pageNum?: number; pageSize?: number }) => void;
  current: number;
  pageSize: number;
}

const pageOptions: Option[] = [
  { value: 60, label: '60条/页' },
  { value: 100, label: '100条/页' },
  { value: 200, label: '200条/页' }
];

function Pager({ onChange, ...restProps }: Props): ReactElement {
  const pageProps = {
    simple: true,
    ...restProps,
    onChange: (pageNum: number) => {
      onChange({
        pageNum
      });
    }
  };
  return (
    <Space>
      <span>共{restProps.total}条</span>
      <Pagination {...pageProps} />
      <Select
        size="small"
        defaultValue={pageOptions[0].value}
        onChange={(pageSize: number) => onChange({ pageSize: pageSize })}
      >
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
