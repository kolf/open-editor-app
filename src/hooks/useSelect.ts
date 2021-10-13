import { useIntl } from 'react-intl';

export const useOptions = <T>(key: string, values: T[]): Option<T>[] => {
  const { formatMessage } = useIntl();
  return values.map(value => ({
    value,
    label: formatMessage({ id: `${key}.${value}` })
  }));
};
