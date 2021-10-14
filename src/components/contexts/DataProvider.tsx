import React, { createContext } from 'react';
import { useRequest } from 'ahooks';
import commonService from 'src/services/commonService';

interface Props {
  providerOptions?: Option<string>[];
  categoryOptions?: Option<string>[];
  allReason?: any[];
  reasonMap: Map<string, string>;
}

function getReasonMap(treeData): Props['reasonMap'] {
  let result = new Map();
  const loop = data => {
    data.forEach(item => {
      const key = item.id + '';
      result.set(key, item.desc);
      if (item.childNodes) {
        loop(item.childNodes);
      }
    });
  };
  if (treeData) {
    loop(treeData);
  }

  return result;
}

export const DataContext = createContext<Props>(null);

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
      allReason,
      reasonMap: getReasonMap(allReason)
    };
  });

  return <DataContext.Provider value={data as Props}>{children}</DataContext.Provider>;
};
