import React, { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Select, Pagination, Space } from 'antd';

export interface Props {
  pageOptions?: number[];
  total?: number;
  onChange?: (value: { pageNum?: number; pageSize?: number }) => void;
  current: number;
  pageSize: number;
}

export default React.memo(function Pager({
  onChange,
  pageOptions = [60, 100, 200],
  ...restProps
}: Props): ReactElement {
  // console.log(restProps.total,'restProps.total')
  const pageProps = {
    simple: true,
    pageOptions,
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
        style={{ width: 80 }}
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
