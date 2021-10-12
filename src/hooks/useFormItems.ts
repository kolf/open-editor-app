import { useLanguagePkg } from './useLanguage';
import { useIntl } from 'react-intl';

export type IFormItem = {
  key: number;
  field: string;
  formType: IFormType;
  placeholder: string;
  options?: Option[];
  restProps?: any;
};

export type IFormType = 'TimeRange' | 'Select' | 'SearchSelect' | 'InputSplit';

export type IFormItemKey = number | { key: number; options: Option[] };

export default function useFormItems(formItemKeys: IFormItemKey[]): IFormItem[] {
  const { formatMessage } = useIntl();

  const formItems: IFormItem[] = [
    {
      key: 1,
      field: 'createdTime',
      formType: 'TimeRange',
      placeholder: formatMessage({ id: 'formItem.createdTime' }),
      restProps: {
        width: 240
      }
    },
    {
      key: 2,
      field: 'qualityEditTime',
      formType: 'TimeRange',
      placeholder: formatMessage({ id: 'formItem.editTime' })
    },
    {
      key: 3,
      field: 'qualityAuditorId',
      formType: 'SearchSelect',
      // placeholder: '审核人',
      placeholder: formatMessage({ id: 'formItem.qualityAuditorId' }),
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
      placeholder: formatMessage({ id: 'formItem.aiQualityScore' })
    },
    {
      key: 7,
      field: 'aiBeautyScore',
      formType: 'InputSplit',
      // placeholder: 'AI美学评分'
      placeholder: formatMessage({ id: 'formItem.createdTime' })
    },
    {
      key: 8,
      field: 'qualityRank',
      formType: 'Select',
      // placeholder: '质量等级',
      placeholder: formatMessage({ id: 'formItem.qualityRank' }),
      options: [
        { value: '1', label: 'A' },
        { value: '2', label: 'B' },
        { value: '3', label: 'C' },
        { value: '4', label: 'D' }
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
        { value: '1', label: formatMessage({ id: 'image.license.1' }) },
        { value: '2', label: formatMessage({ id: 'image.license.2' }) },
        { value: '3', label: formatMessage({ id: 'image.license.3' }) }
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
    }
  ];

  const getFormItems = (formItemKeys: IFormItemKey[]): IFormItem[] => {
    return formItemKeys.map(key => {
      if (typeof key === 'number') {
        return (formItems as IFormItem[]).find(item => item.key === key);
      } else {
        return {
          ...(formItems as IFormItem[]).find(item => item.key === key.key),
          ...key
        };
      }
    });
  };

  return getFormItems(formItemKeys);
}
