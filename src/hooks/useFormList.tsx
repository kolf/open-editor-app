import * as React from 'react';
import { IFormItem } from 'src/components/formlist/FormList';
import formData from 'src/components/formlist/formData.json';

type IFormItemKeys = number[];

export const useFormList = (formItemKeys: IFormItemKeys = []) => {
  const [list, setList] = React.useState<IFormItem[]>([]);

  React.useEffect(() => {
    const nextList = getFormItems(formItemKeys);
    setList(nextList);
  }, formItemKeys);

  const getFormItems = (formItemKeys: IFormItemKeys): IFormItem[] => {
    return (formData as IFormItem[]).filter(item => formItemKeys.includes(item.key));
  };

  return [list];
};
