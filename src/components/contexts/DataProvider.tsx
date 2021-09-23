import React, { createContext } from 'react';
import { useRequest } from 'ahooks';
import commonService from 'src/services/commonService';

interface Props {
  providerOptions?: Option[];
  categoryOptions?: Option[];
  allReason?: any[];
}

export const DataContext = createContext<Props>({});

export const DataProvider = ({ children }) => {
  const { data = [], loading } = useRequest(async () => {
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
  });

  return <DataContext.Provider value={data as Props}>{children}</DataContext.Provider>;
};
