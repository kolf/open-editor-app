import * as React from 'react';
import { useIntl } from 'react-intl';

export const useOptions = <T>(key: string, values: T[]): Option<T>[] => {
  const { formatMessage } = useIntl();
  return values.map(value => ({
    value,
    label: formatMessage({ id: `${key}.${value}` })
  }));
};

export const useAsyncOptions = (language): any => {
  return (options: { enLabel: string; label: string; value: string }[]) => {
    return options.map(o => ({
      value: o.value,
      label: language === 'en-US' ? o.enLabel : o.label,
    }));
  };
};
