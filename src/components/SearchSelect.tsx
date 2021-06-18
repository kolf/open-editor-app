import React, { ReactElement, useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select';
import commonService from 'src/services/commonService';
import { useRequest } from 'ahooks';

function filterOption(input, option) {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export interface Props<ValueType = any> extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  type: 'category' | 'provider' | 'editUser';
  manual?: boolean;
  optionsBefore?: AntdOptions;
  optionsAfter?: AntdOptions;
}

export default function SearchSelect({
  type,
  manual,
  optionsBefore,
  optionsAfter,
  ...otherProps
}: Props): ReactElement {
  const [inputValue, setInputValue] = useState('');
  const { run, loading, data } = useRequest(() => commonService.getOptions({ type, value: inputValue }), {
    initialData: [],
    manual,
    debounceInterval: 900,
    cacheKey: type
  });

  const options = [optionsBefore, ...data, optionsAfter].filter(o => o);

  useEffect(() => {
    if (inputValue) {
      run();
    }
  }, [inputValue]);

  return (
    <Select
      allowClear
      showSearch
      labelInValue
      filterOption={filterOption}
      notFoundContent={loading ? <Spin size="small" /> : null}
      onSearch={setInputValue}
      options={options}
      {...otherProps}
    />
  );
}
