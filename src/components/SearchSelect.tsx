import React, { ReactElement, useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select';
import commonService from 'src/services/commonService';
import { useRequest } from 'ahooks';

export interface Props<ValueType = any> extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  type: 'category' | 'provider' | 'editUser';
  manual?: boolean;
}
export default function SearchSelect({ type, manual, ...otherProps }: Props): ReactElement {
  const [inputValue, setInputValue] = useState('');
  const { run, loading, data } = useRequest(() => commonService.getOptions({ type, value: inputValue }), {
    initialData: [],
    manual,
    debounceInterval: 900
  });

  useEffect(() => {
    if (inputValue) {
      run();
    }
  }, [inputValue]);

  return (
    <Select
      showSearch
      labelInValue
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      onSearch={setInputValue}
      options={data}
      {...otherProps}
    />
  );
}
