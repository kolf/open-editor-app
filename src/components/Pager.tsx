import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Select, Pagination, Space } from 'antd';

export interface Props {
  total?: number;
  onChange?: (value: { pageNum?: number; pageSize?: number }) => void;
  current: number;
  pageSize: number;
}

const pageOptions = [60, 100, 200];

export default React.memo(function Pager({ onChange, ...restProps }: Props): ReactElement {
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
      <span>
        <FormattedMessage id="pager.result.total" values={{ total: restProps.total }} />
      </span>
      <Pagination {...pageProps} />
      <Select
        size="small"
        defaultValue={pageOptions[0]}
        onChange={(pageSize: number) => onChange({ pageSize: pageSize })}
      >
        {pageOptions.map(o => (
          <Select.Option key={o} value={o}>
            <FormattedMessage id="pager.result.size" values={{ size: o }} />
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
});
