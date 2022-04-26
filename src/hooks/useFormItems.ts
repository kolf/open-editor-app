import { useIntl } from 'react-intl';

export type IFormItem = {
  key: number;
  field: string;
  formType: IFormType;
  placeholder: string;
  options?: (Option<string> | number | string)[];
  restProps?: any;
};

export type IFormType = 'TimeRange' | 'Select' | 'SearchSelect' | 'InputSplit';

export type IFormItemKey = number | ({ key: number } & Pick<IFormItem, 'options'>);

export default function useFormItems(formItemKeys: IFormItemKey[]): IFormItem[] {
  const { formatMessage } = useIntl();

  const formItems: IFormItem[] = [
    {
      key: 1,
      field: 'createdTime',
      formType: 'TimeRange',
      placeholder: formatMessage({ id: 'image.createdTime' })
    },
    {
      key: 2,
      field: 'qualityEditTime',
      formType: 'TimeRange',
      placeholder: formatMessage({ id: 'image.qualityEditTime' })
    },
    {
      key: 3,
      field: 'qualityAuditorId',
      formType: 'SearchSelect',
      // placeholder: '审核人',
      placeholder: formatMessage({ id: 'image.qualityAuditorId' }),
      restProps: {
        type: 'editUser'
      }
    },
    {
      key: 4,
      field: 'qualityStatus',
      formType: 'Select',
      // placeholder: '审核状态',
      placeholder: formatMessage({ id: 'formItem.qualityStatus' }),
      options: [
        { value: '14', label: formatMessage({ id: 'image.status.14' }) },
        { value: '24', label: formatMessage({ id: 'image.status.24' }) },
        { value: '34', label: formatMessage({ id: 'image.status.34' }) }
      ]
    },
    {
      key: 5,
      field: 'osiProviderId',
      formType: 'SearchSelect',
      // placeholder: '数据来源',
      placeholder: formatMessage({ id: 'formItem.osiProviderId' }),
      restProps: {
        type: 'provider'
      }
    },
    {
      key: 6,
      field: 'aiQualityScore',
      formType: 'InputSplit',
      // placeholder: 'AI质量评分'
      placeholder: formatMessage({ id: 'image.aiQualityScore' })
    },
    {
      key: 7,
      field: 'aiBeautyScore',
      formType: 'InputSplit',
      // placeholder: 'AI美学评分'
      placeholder: formatMessage({ id: 'image.aiBeautyScore' })
    },
    {
      key: 8,
      field: 'qualityRank',
      formType: 'Select',
      // placeholder: '质量等级',
      placeholder: formatMessage({ id: 'image.qualityRank' }),
      options: [
        { value: '1', label: 'A' },
        { value: '2', label: 'B' },
        { value: '3', label: 'C' },
        { value: '4', label: 'D' },
        { value: '5', label: 'E' },
      ]
    },
    {
      key: 9,
      field: 'priority',
      formType: 'Select',
      // placeholder: '优先级',
      placeholder: formatMessage({ id: 'formItem.priority' }),
      options: [
        { value: '1', label: formatMessage({ id: 'image.priority.1' }) },
        { value: '2', label: formatMessage({ id: 'image.priority.2' }) }
      ]
    },
    {
      key: 10,
      field: 'license',
      formType: 'Select',
      // placeholder: '授权文件',
      placeholder: formatMessage({ id: 'formItem.license' }),
      options: [
        { value: '1', label: formatMessage({ id: 'image.releaseType.1' }) },
        { value: '2', label: formatMessage({ id: 'image.releaseType.2' }) },
        { value: '3', label: formatMessage({ id: 'image.releaseType.3' }) }
      ]
    },
    {
      key: 11,
      field: 'haveSensitve',
      formType: 'Select',
      // placeholder: '敏感词',
      placeholder: formatMessage({ id: 'formItem.haveSensitve' }),
      options: [
        { value: '0', label: formatMessage({ id: 'image.haveSensitve.0' }) },
        { value: '1', label: formatMessage({ id: 'image.haveSensitve.1' }) }
      ]
    },
    {
      key: 12,
      field: 'licenseType',
      formType: 'Select',
      // placeholder: '授权',
      placeholder: formatMessage({ id: 'formItem.licenseType' }),
      options: [
        { value: '1', label: 'RM' },
        { value: '2', label: 'RF' }
      ]
    },
    {
      key: 13,
      field: 'category',
      formType: 'Select',
      // placeholder: 'AI分类'
      placeholder: formatMessage({ id: 'formItem.category' })
    },
    {
      key: 14,
      field: 'keywordsStatus',
      formType: 'Select',
      // placeholder: '审核状态',
      placeholder: formatMessage({ id: 'formItem.keywordsStatus' }),
      options: [
        { value: '14', label: formatMessage({ id: 'image.status.14' }) },
        { value: '15', label: formatMessage({ id: 'image.status.15' }) },
        { value: '24', label: formatMessage({ id: 'image.status.24' }) },
        { value: '34', label: formatMessage({ id: 'image.status.34' }) }
      ]
    },
    {
      key: 15,
      field: 'imageType',
      formType: 'Select',
      placeholder: formatMessage({ id: 'image.imageType' }),
      options: [
        { value: '1', label: formatMessage({ id: 'image.imageType.1' }) },
        { value: '2', label: formatMessage({ id: 'image.imageType.2' }) },
        { value: '3', label: formatMessage({ id: 'image.imageType.3' }) },
        { value: '4', label: formatMessage({ id: 'image.imageType.4' }) },
        { value: '5', label: formatMessage({ id: 'image.imageType.5' }) },
        { value: '6', label: formatMessage({ id: 'image.imageType.6' }) },
        { value: '7', label: formatMessage({ id: 'image.imageType.7' }) }
      ]
    }
  ];

  const getFormItems = (formItemKeys: IFormItemKey[]): IFormItem[] => {
    return formItemKeys.map(key => {
      if (typeof key === 'number') {
        return (formItems as IFormItem[]).find(item => item.key === key);
      } else {
        const originalItem = (formItems as IFormItem[]).find(item => item.key === key.key);
        return {
          ...originalItem,
          ...key,
          ...(originalItem.options && (key as Pick<IFormItem, 'options'>).options
            ? {
                options: originalItem?.options?.filter(o =>
                  key?.options?.find(k => ((k as Option<string>).value || k) == (o as Option<string>).value)
                )
              }
            : {})
        };
      }
    });
  };

  return getFormItems(formItemKeys);
}
