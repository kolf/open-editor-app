import React, { createContext } from 'react';
import { useRequest } from 'ahooks';
import commonService from 'src/services/commonService';
import { useLanguagePkg } from 'src/hooks/useLanguage';
import { useAsyncOptions } from 'src/hooks/useSelect';

interface Props {
  providerOptions?: Option<string>[];
  categoryOptions?: Option<string>[];
  allReason?: any[];
  reasonMap?: Map<string, string>;
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
  const { language } = useLanguagePkg();
  const getAsyncOptions = useAsyncOptions(language);

  const { data = {}, loading } = useRequest(async () => {
    const [providerOptions, categoryOptions, allReason] = await Promise.all([
      commonService.getOptions({ type: 'provider' }, language),
      commonService.getOptions({ type: 'category' }, language),
      commonService.getImageAllReason()
    ]);

    return {
      providerOptions,
      categoryOptions,
      allReason,
      reasonMap: getReasonMap(allReason)
    };
  });

  const makeData = (data: Props): Props => {
    return Object.keys(data).reduce((result, key: keyof Props) => {
      const value = data[key];
      if (/Options$/.test(key) && value) {
        result[key] = getAsyncOptions(value);
      } else {
        result[key] = value;
      }
      return result;
    }, {});
  };

  return <DataContext.Provider value={makeData(data as Props)}>{children}</DataContext.Provider>;
};
