import React, { useState, useEffect, createContext } from 'react';
import { useRequest } from 'ahooks';
import commonService from 'src/services/commonService';

export const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const { data, loading } = useRequest(
    async () => {
      const [providerOptions, categoryOptions, allReason] = await Promise.all([
        commonService.getOptions({ type: 'provider' }),
        commonService.getOptions({ type: 'category' }),
        commonService.getOptions({ type: 'allReason' })
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
