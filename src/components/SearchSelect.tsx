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
  options?: any;
  fixedOptions?: any;
}
/**
 *
 * @param {
 *  type: 筛选项请求类型,
 *  manual: 是否手动触发请求 true是 false否,
 *  otherProps: antd Select组件属性
 * }
 * @returns
 */
export default function SearchSelect({ type, manual, fixedOptions, options, ...otherProps }: Props): ReactElement {
  console.log(options,'options')
  const [inputValue, setInputValue] = useState('');
  const { run, loading, data } = useRequest(() => commonService.getOptions({ type, value: inputValue }), {
    initialData: options || [],
    manual,
    debounceInterval: 900,
    cacheKey: type
  });

  useEffect(() => {
    if (inputValue && !options) {
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
      options={fixedOptions ? [...fixedOptions, ...data] : data}
      {...otherProps}
    />
  );
}
