import { useContext, useMemo } from 'react';
import { DataContext } from 'src/components/contexts/DataProvider';
import { AuditType } from 'src/declarations/enums/query';
import { getLocalStorageItem } from 'src/utils/localStorage';

export const usePermissions = (auditStage?: AuditType) => {
  const permissions = useMemo(() => JSON.parse(getLocalStorageItem('permissons')), []);

  const { providerOptions } = useContext(DataContext);

  const dataSourceOptions = useMemo(() => {
    return providerOptions?.filter(
      o =>
        permissions.find(permission => permission.includes(`DATA-SOURCE:${o.value}`)) &&
        (o as any).auditFlows.includes(auditStage)
    );
  }, [JSON.stringify(providerOptions), permissions]);

  const imageTypeOptions = useMemo(
    () => permissions.filter(p => p.includes('IMAGE-TYPE')).map(p => p.match(/IMAGE-TYPE:(\d+)/)[1]),
    [permissions]
  );

  return { permissions, providerOptions, dataSourceOptions, imageTypeOptions };
};
