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
  const { data, loading } = useRequest(
    async () => {
      const [providerOptions, categoryOptions, allReason] = await Promise.all([
        commonService.getOptions({ type: 'provider' }),
        commonService.getOptions({ type: 'category' }),
        commonService.getImageAllReason()
      ]);
      return {
        providerOptions,
        categoryOptions,
        allReason
      };
    },
    {
      initialData: {}
    }
  );

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
