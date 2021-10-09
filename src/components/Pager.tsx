import React, { ReactElement } from 'react';
import { Select, Pagination, Space } from 'antd';
import { useLanguage } from 'src/hooks/useLanguage';
const { Option } = Select;

export interface Props {
  total?: number;
  onChange?: (value: { pageNum?: number; pageSize?: number }) => void;
  current: number;
  pageSize: number;
}

const pageOptions = [
  { value: 60, label: '60条/页', usLabel: '60/page' },
  { value: 100, label: '100条/页', usLabel: '100/page' },
  { value: 200, label: '200条/页', usLabel: '200/page' }
];

function Pager({ onChange, ...restProps }: Props): ReactElement {
  const isChinese = useLanguage();

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
      <span>{isChinese ? `共${restProps.total}条` : `${restProps.total} results`}</span>
      <Pagination {...pageProps} />
      <Select
        size="small"
        defaultValue={pageOptions[0].value}
        onChange={(pageSize: number) => onChange({ pageSize: pageSize })}
      >
        {pageOptions.map(o => (
          <Option key={o.value} value={o.value}>
            {isChinese ? o.label : o.usLabel}
          </Option>
        ))}
      </Select>
    </Space>
  );
}

export default Pager;
