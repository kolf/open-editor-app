import React, { createContext } from 'react';
import { useRequest } from 'ahooks';
import commonService from 'src/services/commonService';

interface IDataContextInitValue {
  providerOptions?: any,
  categoryOptions?: any,
  allReason?: any
}

export const DataContext = createContext<IDataContextInitValue>({});

export const DataProvider = ({ children }) => {
  const { data: providerOptions } = useRequest(() => commonService.getOptions({ type: 'provider' }), {
    cacheKey: 'provider'
  });
  const { data: categoryOptions } = useRequest(() => commonService.getOptions({ type: 'category' }), {
    cacheKey: 'category'
  });
  const { data: allReason } = useRequest(commonService.getImageAllReason, {
    cacheKey: 'allReason'
  });

  return (
    <DataContext.Provider value={{ providerOptions, categoryOptions, allReason }}>{children}</DataContext.Provider>
  );
};
