import React, { ReactElement, useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select';
import commonService from 'src/services/commonService';
import { useRequest } from 'ahooks';

export interface Props<ValueType = any> extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  type: 'category' | 'provider' | 'editUser';
  manual?: boolean;
  optionsBefore?: AntdOptions;
  optionsAfter?: AntdOptions;
}
/**
 * 
 * @param {
 *  type: 筛选项请求类型,
 *  manual: 是否手动触发请求 true是 false否,
 *  optionsBefore: 前置筛选项
 *  optionsAfter: 后置筛选项
 *  otherProps: antd Select组件属性
 * }
 * @returns 
 */
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
      showSearch
      labelInValue
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : null}
      onSearch={setInputValue}
      options={options}
      {...otherProps}
    />
  );
}
